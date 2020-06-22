import path from 'path';

import {precompileToLocalVar} from './local-var-precompile';
import {getAddonsMeta} from './get-addons-meta';
import {configureEnvironment} from './configure-environment';
import {getNodes} from '../ast/get-nodes';
import {getUsedGlobals} from '../ast/get-used-globals';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getAssets} from '../ast/get-assets';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {hasAsyncTags} from '../ast/has-async-tags';

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
    const staticExtPath = path.join(
        __dirname,
        '..',
        'get-static-extension.js'
    );
    const [
        staticExtension,
        extensionsMeta,
        filtersMeta
    ] = await Promise.all([
        getAddonsMeta([
            ['StaticExtension', staticExtPath]
        ]),
        getAddonsMeta(Object.entries(extensions)),
        getAddonsMeta(Object.entries(filters))
    ]);
    const _extensionsMeta = extensionsMeta.concat(staticExtension);

    const nodes = getNodes(
        source,
        _extensionsMeta.map(([,, ext]) => ext),
        opts
    );

    return Promise.all([
        precompileToLocalVar(source, resourcePath, configureEnvironment({
            searchPaths,
            options: opts,
            extensions: _extensionsMeta,
            filters: filtersMeta
        })),
        getTemplatesImports(nodes, searchPaths)
    ]).then(function([precompiled, dependencies]) {
        return {
            precompiled,
            dependencies,
            globals: getUsedGlobals(nodes, globals),
            extensions: getUsedExtensions(nodes, _extensionsMeta),
            filters: getUsedFilters(nodes, filtersMeta)
        };
    }).then(function(deps) {
        return getAssets(nodes, assetsPaths).then(function(assets) {
            return {
                ...deps,
                assets,
                isAsyncTemplate: hasAsyncTags(nodes)
            };
        })
    });
}
