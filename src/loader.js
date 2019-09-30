import path from 'path';
import {getOptions, stringifyRequest} from 'loader-utils';
import validate from 'schema-utils';

import schema from './schema.json';
import {withDependencies} from './precompile/with-dependencies';
import {getImportPath} from './get-import-path';

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
        jinjaCompat = false,
        searchPaths = '.',
        globals = {},
        extensions = {}
    } = getOptions(this) || {};

    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        jinjaCompat,
        tags,
        searchPaths,
        globals,
        extensions
    };

    validate(schema, options, {
        name: 'Simple Nunjucks Loader',
        baseDataPath: 'options'
    });

    const callback = this.async();

    function foldDependenciesToImports([imports, assignment], [, fullPath], i) {
        const path = JSON.stringify(fullPath);
        const importVar = `templateDependencies${i}`;

        return [
            `${imports}var ${importVar} = require(${path}).dependencies;`,
            `${assignment}${importVar},`
        ];
    }

    const normalizedSearchPaths = [].concat(searchPaths).map(path.normalize);
    const resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );
    withDependencies(resourcePathImport, source, {
        ...options,
        searchPaths: normalizedSearchPaths
    }).then(({dependencies, ...rest}) => ({
        ...rest,
        dependencies: getImports(
            ...dependencies.reduce(foldDependenciesToImports, ['', ''])
        )
    })).then(({dependencies, precompiled, globals, extensions}) => {
        const runtimeImport = `var runtime = require(${stringifyRequest(
            this,
            `${path.resolve(path.join(__dirname, 'runtime.js'))}`
        )});`;
        const globalFnsImports = globals.map(function([globalImport, globalPath]) {
            return `
               var _global_${toVar(globalImport)} = require('${globalPath}');
           `;
        }).join('');
        const extensionsImports = extensions.map(function([name, importPath]) {
            return `
               var _extension_${name} = require('${importPath}');
           `;
        }).join('');

        const resourcePathString = JSON.stringify(resourcePathImport);
        callback(null, `
            ${runtimeImport}
            ${dependencies}
            ${globalFnsImports}
            ${extensionsImports}
            ${precompiled}
            module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                [${globals.map(([globalName]) => {
                    return `['${globalName}', _global_${toVar(globalName)}]`;
                 })}],
                [${extensions.map(([extName]) => {
                    return `['${extName}', _extension_${extName}]`;
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
