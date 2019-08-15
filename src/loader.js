import path from 'path';
import {getOptions, stringifyRequest} from 'loader-utils';
import validate from 'schema-utils';

import schema from './schema.json';
import {withDependencies} from "./precompile/with-dependencies";
import {getImportPath} from "./get-import-path";

function getImports(imports, assignments) {
    return `
        ${imports}
        var precompiledTemplates = Object.assign(
            {},
            ${assignments}
        );
    `;
}

function toVar(symb) {
    return symb.replace(/[.-]/g, '_');
}

export default function nunjucksLoader(source) {
    const {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags,
        searchPaths = '.',
        globals = {}
    } = getOptions(this) || {};

    const callback = this.async();
    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags,
        searchPaths,
        globals
    };

    validate(schema, options, {
        name: 'Simple Nunjucks Loader',
        baseDataPath: 'options'
    });

    function foldDependenciesToImports([imports, assignment], [, fullPath], i) {
        const path = JSON.stringify(fullPath);
        const importVar = `templateDependencies${i}`;

        return [
            `${imports}var ${importVar} = require(${path}).dependencies;`,
            `${assignment}${importVar},`
        ];
    }

    const globalFns = Object.keys(globals);
    const globalFnsImports = `
        ${globalFns.map(function(globalImport) {
            return `
             var _global_${toVar(globalImport)} = require('${
                globals[globalImport]
              }');
           `;
        })}
    `;

    const normalizedSearchPaths = [].concat(searchPaths).map(path.normalize);
    const resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );
    withDependencies(resourcePathImport, source, {
        ...options,
        searchPaths: normalizedSearchPaths
    }).then(({dependencies, precompiled}) => ({
        precompiled,
        dependencies: getImports(
            ...dependencies.reduce(foldDependenciesToImports, ['', ''])
        )
    })).then(({dependencies, precompiled}) => {
        const runtimeImport = `var runtime = require(${stringifyRequest(
            this,
            `${path.resolve(path.join(__dirname, 'runtime.js'))}`
        )});`;

        const resourcePathString = JSON.stringify(resourcePathImport);
        callback(null, `
            ${runtimeImport}
            ${dependencies}
            ${globalFnsImports}
            ${precompiled}
            module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                [${globalFns.map((globalName) => {
                    return `['${globalName}', _global_${toVar(globalName)}]`;
                 })}],
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
