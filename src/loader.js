import path from 'path';
import {getOptions, stringifyRequest} from 'loader-utils';

import {withDependencies} from "./precompile/with-dependencies";

function render(resourcePath, source, options) {
    return withDependencies(resourcePath, source, options);
}

export default function nunjucksLoader(source) {
    const {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags
    } = getOptions(this) || {};

    const callback = this.async();
    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags
    };
    render(this.resourcePath, source, options).then((template) => {
        const {dependencies, precompiled} = template;

        return {
            precompiled,
            dependencies: dependencies.reduce((imports, {fullPath}) => {
                this.addDependency(fullPath);

                const path = JSON.stringify(fullPath);

                return `
                    ${imports}precompiledTemplates[${path}] = require(${path}).precompiled;
               `;
            }, '')
        };
    }).then((template) => {
        const {dependencies, precompiled} = template;

        const runtimeImport = `var runtime = require(${stringifyRequest(
            this,
            `${path.resolve(path.join(__dirname, 'runtime.js'))}`
        )});`;

        const resourcePathString = JSON.stringify(this.resourcePath);
        callback(null, `
            var precompiledTemplates = {};
            ${runtimeImport}
            ${dependencies}
            ${precompiled}
            module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                precompiledTemplates
              );
            
              return nunjucks.render(${resourcePathString}, ctx);
            };

            module.exports.precompiled = precompiledTemplates[${resourcePathString}];
        `);
    }, function(error) {
        callback(error);
    });
}
