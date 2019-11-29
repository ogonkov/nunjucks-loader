import path from 'path';

import {withDependencies} from './precompile/with-dependencies';
import {getImportPath} from './get-import-path';
import {getLoaderOptions} from './get-loader-options';
import {getRuntimeImport} from './output/get-runtime-import';
import {getTemplateDependenciesImport} from './output/get-template-dependencies-import';
import {getGlobals} from './output/get-globals';
import {getExtensions} from './output/get-extensions';

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
        const {
            imports: globalsImports,
            exports: globalsExports,
            moduleExports: globalsModuleExports
        } = getGlobals(globals);
        const {
            imports: extensionsImports,
            exports: extensionsExports,
            moduleExports: extensionsModuleExports
        } = getExtensions(extensions);

        const resourcePathString = JSON.stringify(resourcePathImport);
        callback(null, `
            ${getRuntimeImport(this)}
            ${getTemplateDependenciesImport(dependencies)}
            ${globalsImports()}
            ${extensionsImports()}
            ${precompiled}

            module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                ${globalsExports()},
                ${extensionsExports()},
                precompiledTemplates
              );
            
              return nunjucks.render(${resourcePathString}, ctx);
            };

            module.exports.precompiled = precompiledTemplates[${resourcePathString}];
            module.exports.dependencies = precompiledTemplates;
            module.exports.__nunjucks_module_dependencies__ = {
                globals: {
                    ${globalsModuleExports()}
                },
                extensions: {
                    ${extensionsModuleExports()}
                }
            };
        `);
    }, function(error) {
        callback(error);
    });
}
