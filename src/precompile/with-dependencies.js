import nunjucks from "nunjucks";

import {precompileToLocalVar} from "./local-var-precompile";
import {getDependencies} from "../get-dependencies";
import {getPossiblePaths} from "../get-possible-paths";
import {getFirstExistedPath} from "../get-first-existed-path";

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

function getDependenciesImports(source, searchPaths) {
    const templateDeps = getDependencies(source);
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
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export function withDependencies(resourcePath, source, options) {
    const {searchPaths, ...opts} = options;
    const env = nunjucks.configure(searchPaths, opts);

    return Promise.all([
        precompileToLocalVar(source, resourcePath, env),
        getDependenciesImports(source, searchPaths)
    ]).then(function([precompiled, dependenciesImports]) {
        return {
            precompiled,
            dependencies: dependenciesImports
        };
    });
}
