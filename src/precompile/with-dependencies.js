import fs from 'fs';
import path from 'path';
import {promisify} from 'util';
import nunjucks from "nunjucks";
import * as precompile from './local-var-precompile';

const exists = promisify(fs.access);

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
 * @param {string[]} templatesPath
 * @returns {{name: string, paths: string[]}}
 */
function resolvePossiblePaths(importPath, templatesPath) {
    const paths = [];

    for (let i = 0; i < templatesPath.length; i++) {
        const basePath = path.resolve(templatesPath[i]);
        const filePath = path.resolve(templatesPath[i], importPath);

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
 * @param {string} resourcePath Path to precompiled template to calculate
 *                              dependencies relative to it
 * @param {string} templatesPath
 * @param {string} precompiled
 * @returns {Promise<PrecompiledDependency>}
 */
function getDependencies(resourcePath, templatesPath, precompiled) {
    const dependencies = [];
    const possiblePaths = [];
    let precompiledWithDependencies = precompiled;

    function hasDependency(fullPath) {
        return dependencies.some(function(dependency) {
            return dependency.fullPath === fullPath;
        });
    }

    function containsResourcePath(path) {
        return path === resourcePath;
    }

    const getTemplateRe = /env\s*\.getTemplate\s*\(\s*['"]([^'"]+)['"]/g;
    let match = getTemplateRe.exec(precompiledWithDependencies);
    while (match !== null) {
        if (match.index === getTemplateRe.lastIndex) {
            getTemplateRe.lastIndex++;
        }

        const [, originalName] = match;
        const possiblePath = resolvePossiblePaths(
            originalName,
            [
                path.dirname(resourcePath),
                ...templatesPath
            ]
        );

        if (possiblePath.paths.some(containsResourcePath)) {
            throw new Error(`Circular import detected`);
        }

        possiblePaths.push(possiblePath);

        match = getTemplateRe.exec(precompiledWithDependencies)
    }

    const possiblePathResolve = possiblePaths.map(function({paths, name}) {
        return {
            paths: paths.map(function(path) {
                return exists(path).then(() => path, () => false);
            }),
            name
        };
    }).map(function({paths, name}) {
        return Promise.all(paths).then((paths) => {
            return paths.filter(Boolean);
        }).then(function(paths) {
            return paths[0];
        }).then(function(fullPath) {
            return {
                fullPath,
                originalName: name
            };
        });
    });

    return Promise.all(possiblePathResolve).then(function(paths) {
        paths.forEach(function({fullPath, originalName}) {
            if (hasDependency(path) === false) {
                dependencies.push({
                    fullPath,
                    originalName
                });
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
    const {templatesPath = '.', ...opts} = options;
    const env = nunjucks.configure(templatesPath, opts);

    return precompile.precompileToLocalVar(resourcePath, source, env)
        .then(function(precompiled) {
            const pathsToSearch = (
                Array.isArray(templatesPath) ? templatesPath : [templatesPath]
            ).map(path.normalize);

            return getDependencies(resourcePath, pathsToSearch, precompiled);
        });
}
