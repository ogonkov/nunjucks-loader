import path from 'path';

import {withDependencies} from './precompile/with-dependencies';
import {getImportPath} from './get-import-path';
import {getLoaderOptions} from './get-loader-options';
import {getRuntimeImport} from './output/get-runtime-import';
import {getTemplateDependenciesImport} from './output/get-template-dependencies-import';
import {getGlobals} from './output/get-globals';
import {getExtensions} from './output/get-extensions';
import {getFilters} from './output/get-filters';

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
    }).then(({
        assets,
        dependencies,
        precompiled,
        globals,
        extensions,
        filters
    }) => {
        const {
            imports: globalsImports
        } = getGlobals(globals.concat(Object.keys(assets).length ? [
            ['static', path.join(__dirname, './static.js')]
        ] : []));
        const {
            imports: extensionsImports
        } = getExtensions(extensions);
        const {
            imports: filtersImports
        } = getFilters(filters);

        const resourcePathString = JSON.stringify(resourcePathImport);
        // Only required options
        // https://mozilla.github.io/nunjucks/api.html#constructor
        const envOptions = JSON.stringify({
            autoescape: options.autoescape,
            throwOnUndefined: options.throwOnUndefined,
            trimBlocks: options.trimBlocks,
            lstripBlocks: options.lstripBlocks,
            // Loader specific option
            jinjaCompat: options.jinjaCompat
        });
        callback(null, `
            ${getRuntimeImport(this)}
            ${getTemplateDependenciesImport(dependencies)}
            ${globalsImports()}
            ${extensionsImports()}
            ${filtersImports()}
            ${precompiled}

            exports = module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${envOptions},
                __nunjucks_module_dependencies__
              );

              if (nunjucks.isAsync()) {
                return new Promise(function(resolve, reject) {
                  nunjucks.render(${resourcePathString}, ctx, function(err, res) {
                    if (err) {
                      return reject(err);
                    }
                    
                    resolve(res);
                  });
                });
              }
            
              return nunjucks.render(${resourcePathString}, ctx);
            };

            exports.__nunjucks_precompiled_template__ = __nunjucks_module_dependencies__.templates[${resourcePathString}];
            exports.__nunjucks_module_dependencies__ = __nunjucks_module_dependencies__;
        `);
    }, function(error) {
        callback(error);
    });
}
