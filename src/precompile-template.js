import path from 'path';
import nunjucks from "nunjucks";
import * as precompile from './precompile/file';

/**
 * @typedef {Object} NunjucksOptions
 * @property {boolean}                 [autoescape=true]
 * @property {boolean}                 [throwOnUndefined=false]
 * @property {boolean}                 [trimBlocks=false]
 * @property {boolean}                 [lstripBlocks=false]
 * @property {Object.<string, string>} [tags]
 */

/**
 * @param {string} fileName
 * @param {string} rootFileName
 * @returns {string}
 */
function resolveTemplatePath(fileName, rootFileName) {
    const rootFolder = path.dirname(rootFileName);

    return path.join(rootFolder, fileName)
}

/**
 * Generate regex for `env.getTemplate` invocation
 *
 * @param {string} name
 * @returns {RegExp}
 */
function getTemplateReFor(name) {
    return new RegExp(
        `(env\\s*\\.getTemplate\\s*\\(\\s*['"])${
            name.replace(/([./])/g, '\\$1')
        }(['"])`,
        'g'
    );
}

/**
 * @typedef {Object} PrecompiledDependencyLink
 * @property {string} originalName Name as it appear in template
 * @property {string} fullPath     Resolved absolute path
 */

/**
 * Get precompiled template dependencies and replace them
 * in precompiled template
 *
 * @param {string} resourcePath Path to precompiled template to calculate
 *                              dependencies relative to it
 * @param {string} precompiled
 * @returns {{precompiled: string, dependencies: PrecompiledDependencyLink[]}}
 */
function getPrecompiledWithDependencies(resourcePath, precompiled) {
    const dependencies = [];
    let precompiledWithDependencies = precompiled;

    const getTemplateRe = /env\s*\.getTemplate\s*\(\s*['"]([^'"]+)['"]/g;
    let match = getTemplateRe.exec(precompiledWithDependencies);

    while (match !== null) {
        if (match.index === getTemplateRe.lastIndex) {
            getTemplateRe.lastIndex++;
        }

        const [, originalName] = match;
        const fullPath = resolveTemplatePath(originalName, resourcePath);

        dependencies.push({
            originalName,
            fullPath
        });

        precompiledWithDependencies = precompiledWithDependencies.replace(
            getTemplateReFor(originalName),
            `$1${fullPath}$2`
        );

        match = getTemplateRe.exec(fullPath)
    }

    return {
        dependencies,
        precompiled: precompiledWithDependencies
    };
}

function walkTemplates(resourcePath, precompiled, env, hash) {
    let {
        precompiled: precompiledWithDependencies,
        dependencies: dependantTemplates
    } = getPrecompiledWithDependencies(
        resourcePath,
        precompiled
    );

    hash[resourcePath] = precompiledWithDependencies;

    return new Promise(function(resolve) {
        if (dependantTemplates.length === 0) {
            return resolve({
                dependencies: dependantTemplates,
                precompiled: precompiledWithDependencies
            });
        }

        dependantTemplates.reduce(function(sequence, templateLink) {
            return sequence.then(function(template) {
                const {fullPath: templatePath} = templateLink;

                if (templatePath in hash) {
                    return Promise.resolve(template);
                }

                return precompile.byPath(templatePath, env)
                    .then(function(precompiled) {
                        return walkTemplates(
                            templatePath,
                            precompiled,
                            env,
                            hash
                        );
                    })
                    .then(function(currentTemplate) {
                        return {
                            dependencies: [
                                ...template.dependencies,
                                ...currentTemplate.dependencies
                            ],
                            precompiled: `
                            ${template.precompiled}
                            ${currentTemplate.precompiled}
                          `
                        };
                    });
            });
        }, Promise.resolve({
            dependencies: dependantTemplates,
            precompiled: precompiledWithDependencies
        })).then(resolve);
    });
}

/**
 * @param {Object} loader
 * @param {string} source
 * @param {NunjucksOptions} options
 * @returns {Promise<string>} Source of precompiled template with wrapper
 */
export function precompileTemplate(loader, source, options) {
    const env = nunjucks.configure(options);
    const {resourcePath} = loader;
    const precompiledHash = {};

    return precompile.bySource(resourcePath, source, env)
        .then(function(precompiled) {
            return walkTemplates(
                resourcePath,
                precompiled,
                env,
                precompiledHash
            );
        })
        .then(function(template) {
            template.dependencies.map(function(dependency) {
                return dependency.fullPath;
            }).forEach(function(dependency) {
                loader.addDependency(dependency);
            });

            return template.precompiled;
        });
}
