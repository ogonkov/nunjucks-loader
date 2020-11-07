import {getAssets} from '../ast/get-assets';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getUsedGlobals} from '../ast/get-used-globals';

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
 * @param {InstancesList} extensions
 * @param {InstancesList} filters
 * @param {Object} loaderOptions
 * @returns {Promise<Object>}
 */
export async function getUsedDependencies(
    nodes,
    extensions,
    filters,
    loaderOptions
) {
    const {
        searchPaths,
        assetsPaths,
        globals
    } = loaderOptions;

    const [templates, assets] = await Promise.all([
        getTemplatesImports(nodes, searchPaths),
        getAssets(nodes, assetsPaths)
    ]);

    return {
        templates,
        globals: getUsedGlobals(nodes, globals),
        extensions: getUsedExtensions(nodes, extensions),
        filters: getUsedFilters(nodes, filters),
        assets
    };
}
