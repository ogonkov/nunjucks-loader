import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import nunjucks from "nunjucks";
import {precompileToLocalVar} from "./local-var-precompile";

const isExists = promisify(fs.access);

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
 * @param {string}   importPath
 * @param {string[]} searchPaths
 * @returns {{name: string, paths: string[]}}
 */
function resolveSearchPaths(importPath, searchPaths) {
    const paths = [];

    for (let i = 0; i < searchPaths.length; i++) {
        const basePath = path.resolve(searchPaths[i]);
        const filePath = path.resolve(searchPaths[i], importPath);

        if (filePath.startsWith(basePath)) {
            paths.push(filePath);
        }
    }

    return {
        name: importPath,
        paths
    };
}

/**
 * Generate regex for `env.getTemplate` invocation
 *
 * @param {string} importPath
 * @returns {RegExp}
 */
function getTemplateReFor(importPath) {
    return new RegExp(
        `(env\\s*\\.getTemplate\\s*\\(\\s*['"])${
            importPath.replace(/([./])/g, '\\$1')
        }(['"])`
    );
}

function getTemplatePaths(resourcePath, precompiled, searchPaths) {
    const possiblePaths = [];

    const getTemplateRe = /env\s*\.getTemplate\s*\(\s*['"]([^'"]+)['"]/g;
    let match = getTemplateRe.exec(precompiled);

    function containsResourcePath(path) {
        return path === resourcePath;
    }

    while (match !== null) {
        if (match.index === getTemplateRe.lastIndex) {
            getTemplateRe.lastIndex++;
        }

        const [, originalName] = match;
        const possiblePath = resolveSearchPaths(
            originalName,
            [
                ...searchPaths,
                path.dirname(resourcePath)
            ]
        );

        if (possiblePath.paths.some(containsResourcePath)) {
            throw new Error(`Circular import detected`);
        }

        possiblePaths.push(possiblePath);

        match = getTemplateRe.exec(precompiled)
    }

    return possiblePaths;
}

function foldFirstExistedPath(examinePath, path) {
    return examinePath.then(function(existedFile) {
        if (typeof existedFile === 'string') {
            return existedFile;
        }

        return isExists(path).then(
            () => path,
            () => false
        );
    });
}

function toResolvedDependency({paths, name}) {
    function examineFoundPath(fullPath) {
        if (typeof fullPath !== 'string') {
            throw Error(`Template "${name}" not found`);
        }

        return fullPath;
    }

    function getResolvedDependency(fullPath) {
        return {
            fullPath,
            originalName: name
        };
    }

    return paths.reduce(foldFirstExistedPath, Promise.resolve())
        .then(examineFoundPath)
        .then(getResolvedDependency);
}

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
 * Get precompiled template dependencies and replace them
 * in precompiled template
 *
 * @param {string}   resourcePath Path to precompiled template to calculate
 *                                dependencies relative to it
 * @param {string[]} searchPaths
 * @param {string}   precompiled
 * @returns {Promise<PrecompiledDependency>}
 */
function getDependencies(resourcePath, searchPaths, precompiled) {
    const resolvedTemplates = getTemplatePaths(
        resourcePath,
        precompiled,
        searchPaths
    ).map(toResolvedDependency);

    return Promise.all(resolvedTemplates).then(function(paths) {
        const dependencies = [];
        let precompiledWithDependencies = precompiled;

        function hasDependency(fullPath) {
            return dependencies.some(function(dependency) {
                return dependency === fullPath;
            });
        }

        paths.forEach(function({fullPath, originalName}) {
            if (hasDependency(fullPath) === false) {
                dependencies.push(fullPath);
            }

            precompiledWithDependencies = precompiledWithDependencies.replace(
                getTemplateReFor(originalName),
                `$1${fullPath}$2`
            );
        });

        return {
            dependencies,
            precompiled: precompiledWithDependencies
        };
    });
}

/**
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export function withDependencies(resourcePath, source, options) {
    const {searchPaths = '.', ...opts} = options;
    const env = nunjucks.configure(searchPaths, opts);

    return precompileToLocalVar(resourcePath, source, env)
        .then(function(precompiled) {
            const pathsToSearch = [].concat(searchPaths).map(path.normalize);

            return getDependencies(resourcePath, pathsToSearch, precompiled);
        });
}
