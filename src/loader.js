import path from 'path';

import {withDependencies} from './precompile/with-dependencies';
import {getImportPath} from './get-import-path';
import {getLoaderOptions} from './get-loader-options';
import {getRuntimeImport} from './output/get-runtime-import';
import {getTemplateDependenciesImport} from './output/get-template-dependencies-import';

function toVar(symb) {
    return symb.replace(/[.-]/g, '_');
}

export default function nunjucksLoader(source) {
    const callback = this.async();
    const options = getLoaderOptions(this, callback);
    const normalizedSearchPaths = [].concat(options.searchPaths).map(path.normalize);
    const resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );

    withDependencies(resourcePathImport, source, {
        ...options,
        searchPaths: normalizedSearchPaths
    }).then(({dependencies, precompiled, globals, extensions}) => {
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
            ${getRuntimeImport(this)}
            ${getTemplateDependenciesImport(dependencies)}
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
