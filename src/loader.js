import path from 'path';
import {getOptions, stringifyRequest} from 'loader-utils';
import validate from 'schema-utils';

import schema from './schema.json';
import {withDependencies} from "./precompile/with-dependencies";

export default function nunjucksLoader(source) {
    const {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags,
        searchPaths
    } = getOptions(this) || {};

    const callback = this.async();
    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags,
        searchPaths
    };

    validate(schema, options, {
        name: 'Simple Nunjucks Loader',
        baseDataPath: 'options'
    });

    withDependencies(this.resourcePath, source, options).then((template) => {
        const {dependencies, precompiled} = template;

        return {
            precompiled,
            dependencies: dependencies.reduce(([imports, assignment], fullPath, i) => {
                this.addDependency(fullPath);

                const path = JSON.stringify(fullPath);
                const importVar = `templateDependencies${i}`;

                return [
                    `${imports}var ${importVar} = require(${path}).dependencies;`,
                    `${assignment}${importVar},`
                ];
            }, ['', ''])
        };
    }).then((template) => {
        const {dependencies, precompiled} = template;

        const runtimeImport = `var runtime = require(${stringifyRequest(
            this,
            `${path.resolve(path.join(__dirname, 'runtime.js'))}`
        )});`;

        const resourcePathString = JSON.stringify(this.resourcePath);
        const [dependenciesImport, dependenciesAssignment] = dependencies;
        callback(null, `
            ${runtimeImport}
            ${dependenciesImport}
            var precompiledTemplates = Object.assign(
                {},
                ${dependenciesAssignment}
            );
            ${precompiled}
            module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                precompiledTemplates
              );
            
              return nunjucks.render(${resourcePathString}, ctx);
            };

            module.exports.precompiled = precompiledTemplates[${resourcePathString}];
            module.exports.dependencies = precompiledTemplates;
        `);
    }, function(error) {
        callback(error);
    });
}
