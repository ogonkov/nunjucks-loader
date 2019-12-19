import nunjucks from 'nunjucks';

import {precompileToLocalVar} from './local-var-precompile';
import {getDependenciesTemplates} from '../get-dependencies-templates';
import {getPossiblePaths} from '../get-possible-paths';
import {getFirstExistedPath} from '../get-first-existed-path';
import {getAddonsMeta} from './get-addons-meta';
import {configureEnvironment} from './configure-environment';
import {getNodes} from './get-nodes';
import {indexOf} from './index-of';
import {toListItem} from './to-list-item';

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

function getDependenciesGlobals(nodes, globals) {
    const usedGlobals = nodes
        .findAll(nunjucks.nodes.FunCall)
        .map((global) => global.name.value)
        .filter(Boolean);

    if (usedGlobals.length === 0) {
        return [];
    }

    return Object.keys(globals)
        .filter((fnName) => usedGlobals.includes(fnName))
        .map((fnName) => [fnName, globals[fnName]]);
}

/**
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export function withDependencies(resourcePath, source, options) {
    const {searchPaths, globals, extensions, filters, ...opts} = options;
    const extensionsInstances = await getAddonsMeta(extensions);
    const filtersInstances = await getAddonsMeta(filters);

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        opts
    );

    const extensionsNodes = nodes.findAll(nunjucks.nodes.CallExtension);
    const extensionCalls = extensionsNodes.map(toListItem(
        extensionsInstances, ({extName}) => (([name,, instance]) => {
            // Sometime `extName` is instance of custom tag
            return name === extName || instance === extName
        })
    )).filter(Boolean).filter(([extensionName], i, extensions) => {
        return i === indexOf(extensions, ([name]) => name === extensionName);
    });

    const filterNodes = nodes.findAll(nunjucks.nodes.Filter);
    const filtersCalls = filterNodes.map(toListItem(
        filtersInstances, ({name}) => (
            ([filterName]) => filterName === name.value
        )
    )).filter(Boolean).filter(([filterName], i, filters) => {
        return i === indexOf(filters, ([name]) => name === filterName);
    });

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
            globals: getDependenciesGlobals(nodes, globals),
            extensions: extensionCalls,
            filters: filtersCalls
        };
    });
}
