import nunjucks from 'nunjucks';

import {precompileToLocalVar} from './local-var-precompile';
import {getDependenciesTemplates} from '../get-dependencies-templates';
import {getPossiblePaths} from '../get-possible-paths';
import {getFirstExistedPath} from '../get-first-existed-path';

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
    const {searchPaths, globals, extensions, ...opts} = options;
    const env = nunjucks.configure(searchPaths, opts);
    const nodes = nunjucks.parser.parse(
        source,
        Object.values(extensions).map((ext) => require(ext))
    );

    Object.entries(extensions).forEach(function([name, importPath]) {
        env.addExtension(name, require(importPath));
    });

    return Promise.all([
        precompileToLocalVar(source, resourcePath, env),
        getDependenciesImports(nodes, searchPaths)
    ]).then(function([precompiled, dependencies]) {
        return {
            precompiled,
            dependencies,
            globals: getDependenciesGlobals(nodes, globals)
        };
    });
}
