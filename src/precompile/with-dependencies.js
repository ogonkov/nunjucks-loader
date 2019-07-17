import path from 'path';
import nunjucks from "nunjucks";
import * as precompile from './local-var-precompile';

/**
 * @typedef {Object} NunjucksOptions
 * @property {boolean}                 [autoescape=true]
 * @property {boolean}                 [throwOnUndefined=false]
 * @property {boolean}                 [trimBlocks=false]
 * @property {boolean}                 [lstripBlocks=false]
 * @property {Object.<string, string>} [tags]
 */

/**
 * @param {string} importPath
 * @param {string} templatePath
 * @returns {string}
 */
function resolveTemplatePath(importPath, templatePath) {
    const rootFolder = path.dirname(templatePath);

    return path.join(rootFolder, importPath)
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
 * @param {string} precompiled
 * @returns {PrecompiledDependency}
 */
function getDependencies(resourcePath, precompiled) {
    const dependencies = [];
    let precompiledWithDependencies = precompiled;

    function hasDependency(fullPath) {
        return dependencies.some(function(dependency) {
            return dependency.fullPath === fullPath;
        });
    }

    const getTemplateRe = /env\s*\.getTemplate\s*\(\s*['"]([^'"]+)['"]/g;
    let match = getTemplateRe.exec(precompiledWithDependencies);
    while (match !== null) {
        if (match.index === getTemplateRe.lastIndex) {
            getTemplateRe.lastIndex++;
        }

        const [, originalName] = match;
        const fullPath = resolveTemplatePath(originalName, resourcePath);

        if (hasDependency(fullPath) === false) {
            dependencies.push({
                originalName,
                fullPath
            });
        }

        precompiledWithDependencies = precompiledWithDependencies.replace(
            getTemplateReFor(originalName),
            `$1${fullPath}$2`
        );

        match = getTemplateRe.exec(precompiledWithDependencies)
    }

    return {
        dependencies,
        precompiled: precompiledWithDependencies
    };
}

/**
 * @param {string} resourcePath
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export function withDependencies(resourcePath, source, options) {
    const env = nunjucks.configure(options);

    return precompile.precompileToLocalVar(resourcePath, source, env)
        .then(function(precompiled) {
            return getDependencies(resourcePath, precompiled);
        });
}
