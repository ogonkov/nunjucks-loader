import nunjucks from 'nunjucks';

import {precompileToLocalVar} from './local-var-precompile';
import {getDependenciesTemplates} from '../get-dependencies-templates';
import {getPossiblePaths} from '../get-possible-paths';
import {getFirstExistedPath} from '../get-first-existed-path';
import {getAddonsMeta} from './get-addons-meta';
import {configureEnvironment} from './configure-environment';
import {getNodes} from './get-nodes';
import {getUsagesOf} from './get-usages-of';
import {getNodesValues} from './get-nodes-values';

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
 * @param {nunjucks.nodes.Root}     nodes
 * @param {Object.<string, string>} globals
 * @returns {string[]}
 */
function getTemplateGlobals(nodes, globals) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        Object.entries(globals), ({name: globalName}) => ([name]) => (
            globalName.value === name
        )
    );
}

function getGlobalFnValue(node) {
    if (node.name.value !== 'static') {
        return;
    }

    const [asset] = node.args.children;

    return asset.value;
}

function isUnique(item, i, list) {
    return list.indexOf(item) === i;
}

function getAssets(nodes) {
    return getNodesValues(
        nodes,
        nunjucks.nodes.FunCall,
        getGlobalFnValue
    ).filter(isUnique);
}

/**
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export async function withDependencies(resourcePath, source, options) {
    const {searchPaths, globals, extensions, filters, ...opts} = options;
    const extensionsInstances = await getAddonsMeta(extensions);
    const filtersInstances = await getAddonsMeta(filters);

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        opts
    );

    const extensionCalls = getUsagesOf(nunjucks.nodes.CallExtension, nodes)(
        extensionsInstances, ({extName}) => (([name,, instance]) => {
            // Sometime `extName` is instance of custom tag
            return name === extName || instance === extName
        })
    );

    const filtersCalls = getUsagesOf(nunjucks.nodes.Filter, nodes)(
        filtersInstances, ({name}) => (
            ([filterName]) => filterName === name.value
        )
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
            assets: getAssets(nodes),
            precompiled,
            dependencies,
            globals: getTemplateGlobals(nodes, globals),
            extensions: extensionCalls,
            filters: filtersCalls
        };
    });
}
