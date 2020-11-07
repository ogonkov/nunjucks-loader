import {getAssets} from '../ast/get-assets';
import {getNodes} from '../ast/get-nodes';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getUsedGlobals} from '../ast/get-used-globals';
import {hasAsyncTags} from '../ast/has-async-tags';

import {getAddonsMeta} from './get-addons-meta';

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
 * @param {string} resourcePath
 * @param {string} source
 * @param {Object} loaderOptions
 * @param {NunjucksOptions} nunjucksOptions
 * @returns {Promise<Object>}
 */
export async function getDependencies(
    resourcePath,
    source,
    loaderOptions,
    nunjucksOptions
) {
    const {
        searchPaths,
        assetsPaths,
        globals,
        extensions,
        filters
    } = loaderOptions;
    const extensionsInstances = await getAddonsMeta(Object.entries(extensions));

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        nunjucksOptions
    );

    const [filtersInstances, dependencies, assets] = await Promise.all([
        getAddonsMeta(Object.entries(filters)),
        getTemplatesImports(nodes, searchPaths),
        getAssets(nodes, assetsPaths)
    ]);

    return {
        dependencies,
        globals: getUsedGlobals(nodes, globals),
        extensions: getUsedExtensions(nodes, extensionsInstances),
        extensionsInstances,
        filters: getUsedFilters(nodes, filtersInstances),
        filtersInstances,
        assets,
        isAsyncTemplate: hasAsyncTags(nodes)
    };
}
