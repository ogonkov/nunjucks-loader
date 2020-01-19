import {precompileToLocalVar} from './local-var-precompile';
import {getDependenciesTemplates} from '../ast/get-dependencies-templates';
import {getPossiblePaths} from '../get-possible-paths';
import {getFirstExistedPath} from '../get-first-existed-path';
import {getAddonsMeta} from './get-addons-meta';
import {configureEnvironment} from './configure-environment';
import {getNodes} from '../ast/get-nodes';
import {getUsedGlobals} from '../ast/get-used-globals';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getAssets} from '../ast/get-assets';

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
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Object}
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
