import path from 'path';
import {stringifyRequest} from 'loader-utils';

import {withDependencies} from './precompile/with-dependencies';
import {getImportPath} from './get-import-path';
import {getLoaderOptions} from './get-loader-options';

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
    const callback = this.async();
    const options = getLoaderOptions(this, callback);

    function foldDependenciesToImports([imports, assignment], [, fullPath], i) {
        const path = JSON.stringify(fullPath);
        const importVar = `templateDependencies${i}`;

        return [
            `${imports}var ${importVar} = require(${path}).dependencies;`,
            `${assignment}${importVar},`
        ];
    }

    const normalizedSearchPaths = [].concat(options.searchPaths).map(path.normalize);
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
