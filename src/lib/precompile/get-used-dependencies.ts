import type {nodes} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import type {FilterWrapper} from '../addons-wrapper/FilterWrapper';
import {getAssets} from '../ast/get-assets';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getUsedGlobals} from '../ast/get-used-globals';

import {getAddonsMeta} from './get-addons-meta';
import type {UsedDependenciesOptions} from './types';


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
 * @param {Object} loaderContext
 * @param {nunjucks.nodes.Root} nodes
 * @param {AddonWrapper[]} extensions
 * @param {FilterWrapper[]} filters
 * @param {Object} loaderOptions
 * @returns {Promise<Object>}
 */
export async function getUsedDependencies(
    loaderContext: LoaderContext<unknown>,
    nodes: nodes.Root,
    extensions: AddonWrapper[],
    filters: FilterWrapper[],
    loaderOptions: UsedDependenciesOptions
) {
    const {
        searchPaths,
        assetsPaths,
        globals,
        esModule
    } = loaderOptions;

    const [templates, assets, _globals] = await Promise.all([
        getTemplatesImports(loaderContext, nodes, searchPaths),
        getAssets(nodes, assetsPaths),
        getAddonsMeta(globals, {
            es: esModule,
            type: 'globals',
            loaderContext
        })
    ]);

    return {
        templates,
        globals: getUsedGlobals(nodes, _globals),
        extensions: getUsedExtensions(nodes, extensions),
        filters: getUsedFilters(nodes, filters),
        assets
    };
}
