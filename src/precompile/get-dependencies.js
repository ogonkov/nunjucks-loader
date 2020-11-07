import {getAssets} from '../ast/get-assets';
import {getNodes} from '../ast/get-nodes';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getUsedGlobals} from '../ast/get-used-globals';
import {hasAsyncTags} from '../ast/has-async-tags';

import {configureEnvironment} from './configure-environment';
import {getAddonsMeta} from './get-addons-meta';
import {precompileToLocalVar} from './precompile-to-local-var';

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
 * @param {NunjucksOptions} options
 * @returns {Promise<Object>}
 */
export async function getDependencies(resourcePath, source, options) {
    const {
        searchPaths,
        assetsPaths,
        globals,
        extensions,
        filters,
        ...opts
    } = options;
    const extensionsInstances = await getAddonsMeta(Object.entries(extensions));

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        opts
    );

    const [filtersInstances, dependencies, assets] = await Promise.all([
        getAddonsMeta(Object.entries(filters)),
        getTemplatesImports(nodes, searchPaths),
        getAssets(nodes, assetsPaths)
    ]);

    const precompiled = precompileToLocalVar(source, resourcePath, configureEnvironment({
        searchPaths,
        options: opts,
        extensions: extensionsInstances,
        filters: filtersInstances
    }));

    return {
        precompiled,
        dependencies,
        globals: getUsedGlobals(nodes, globals),
        extensions: getUsedExtensions(nodes, extensionsInstances),
        filters: getUsedFilters(nodes, filtersInstances),
        assets,
        isAsyncTemplate: hasAsyncTags(nodes)
    };
}
