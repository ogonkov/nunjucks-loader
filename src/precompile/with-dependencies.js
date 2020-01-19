import nunjucks from 'nunjucks';

import {precompileToLocalVar} from './local-var-precompile';
import {getDependenciesTemplates} from '../ast/get-dependencies-templates';
import {getPossiblePaths} from '../get-possible-paths';
import {getFirstExistedPath} from '../get-first-existed-path';
import {getAddonsMeta} from './get-addons-meta';
import {configureEnvironment} from './configure-environment';
import {getNodes} from '../ast/get-nodes';
import {getNodesValues} from '../ast/get-nodes-values';
import {ERROR_MODULE_NOT_FOUND} from '../constants';
import {getUsedGlobals} from '../ast/get-used-globals';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {isUnique} from '../utils/is-unique';

/**
 * @typedef {Object} NunjucksOptions
 * @property {boolean}                 [autoescape=true]
 * @property {boolean}                 [throwOnUndefined=false]
 * @property {boolean}                 [trimBlocks=false]
 * @property {boolean}                 [lstripBlocks=false]
 * @property {Object.<string, string>} [tags]
 * @property {string}                  [templatesPath]
 */


/**
 * @typedef {Object} TemplatePossiblePaths
 * @property {string}   name
 * @property {string[]} paths
 */

/**
 * @typedef {Object} PrecompiledDependencyLink
 * @property {string} originalName Name as it appear in template
 * @property {string} fullPath     Resolved absolute path
 */

/**
 * @typedef {Object} PrecompiledDependency
 * @property {string}                      precompiled
 * @property {PrecompiledDependencyLink[]} dependencies
 */

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {string[]}            searchPaths
 * @returns {Promise<[string, string][]>}
 */
function getDependenciesImports(nodes, searchPaths) {
    const templateDeps = getDependenciesTemplates(nodes);
    const possiblePaths = getPossiblePaths(templateDeps, searchPaths);
    const resolvedTemplates = possiblePaths.map(function([path, paths]) {
        return getFirstExistedPath(paths).then(function(importPath) {
            return [path, importPath];
        }, function() {
            throw new Error(`Template "${path}" not found`);
        });
    });

    return Promise.all(resolvedTemplates);
}

/**
 * Parse `Add` value to expression
 * @example
 *   'foo' + bar + 'qux'
 *
 * @param {nunjucks.nodes.Add} node
 */
function getAddNodeValue(node) {
    if (!(node instanceof nunjucks.nodes.Add)) {
        throw new TypeError('Wrong node type');
    }

    return [node.left, node.right].map(function(node) {
        if (node instanceof nunjucks.nodes.Add) {
            return getAddNodeValue(node);
        }

        if (node instanceof nunjucks.nodes.Literal) {
            return `"${node.value}"`;
        }

        if (node instanceof nunjucks.nodes.Symbol) {
            return node.value;
        }

        throw new TypeError('Unsupported node signature');
    }).join(' + ');
}

function getGlobalFnValue(node) {
    if (node.name.value !== 'static') {
        return;
    }

    const [asset] = node.args.children;

    if (asset instanceof nunjucks.nodes.Add) {
        return getAddNodeValue(asset);
    }

    return asset.value;
}

function getAssets(nodes, searchAssets) {
    const assets = getNodesValues(
        nodes,
        nunjucks.nodes.FunCall,
        getGlobalFnValue
    ).filter(isUnique);
    const possiblePaths = getPossiblePaths(assets, [].concat(searchAssets));
    const resolvedAssets = possiblePaths.map(function([path, paths]) {
        return getFirstExistedPath(paths).then(function(importPath) {
            return [path, importPath];
        }, function(error) {
            if (error.code !== ERROR_MODULE_NOT_FOUND) {
                throw new Error(`Asset "${path}" not found`);
            }

            throw error;
        })
    });

    return Promise.all(resolvedAssets);
}

/**
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export async function withDependencies(resourcePath, source, options) {
    const {
        searchPaths,
        assetsPaths,
        globals,
        extensions,
        filters,
        ...opts
    } = options;
    const [extensionsInstances, filtersInstances] = await Promise.all([
        getAddonsMeta(extensions),
        getAddonsMeta(filters)
    ]);

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        opts
    );

    return Promise.all([
        precompileToLocalVar(source, resourcePath, configureEnvironment({
            searchPaths,
            options: opts,
            extensions: extensionsInstances,
            filters: filtersInstances
        })),
        getDependenciesImports(nodes, searchPaths)
    ]).then(function([precompiled, dependencies]) {
        return {
            precompiled,
            dependencies,
            globals: getUsedGlobals(nodes, globals),
            extensions: getUsedExtensions(nodes, extensionsInstances),
            filters: getUsedFilters(nodes, filtersInstances)
        };
    }).then(function(deps) {
        return getAssets(nodes, assetsPaths).then(function(assets) {
            return {
                ...deps,
                assets
            };
        })
    });
}
