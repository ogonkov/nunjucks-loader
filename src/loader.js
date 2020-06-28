import path from 'path';

import {getDependencies} from './precompile/get-dependencies';
import {getImportPath} from './utils/get-import-path';
import {getLoaderOptions} from './get-loader-options';
import {getRuntimeImport} from './output/get-runtime-import';
import {getTemplateDependenciesImport} from './output/get-template-dependencies-import';
import {getGlobals} from './output/get-globals';
import {getExtensions} from './output/get-extensions';
import {getFilters} from './output/get-filters';
import {getAssets} from './output/get-assets';
import {toAssetsUUID} from './output/to-assets-uuid';
import {replaceAssets} from './output/replace-assets';
import {ERROR_MODULE_NOT_FOUND, TEMPLATE_DEPENDENCIES} from './constants';

export default function nunjucksLoader(source) {
    const isWindows = process.platform === 'win32';
    const callback = this.async();
    const options = getLoaderOptions(this, callback);

    if (options === null) {
        return;
    }

    const normalizedSearchPaths = [].concat(options.searchPaths).map(path.normalize);
    let resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );

    if (isWindows) {
        resourcePathImport = resourcePathImport.replace(/\\/g, '/');
    }

    getDependencies(resourcePathImport, source, {
        ...options,
        searchPaths: normalizedSearchPaths
    }).then(({
        assets,
        dependencies,
        precompiled,
        globals,
        extensions,
        filters,
        isAsyncTemplate
    }) => {
        const hasAssets = Object.keys(assets).length > 0;
        const assetsUUID = toAssetsUUID(assets);
        const {
            imports: globalsImports
        } = getGlobals(globals.concat(hasAssets ? [
            ['static', path.join(__dirname, './static.js')]
        ] : []));
        const {
            imports: extensionsImports
        } = getExtensions(extensions);
        const {
            imports: filtersImports
        } = getFilters(filters);

        const resourcePathString = JSON.stringify(resourcePathImport);
        const envOptions = JSON.stringify({
            // https://mozilla.github.io/nunjucks/api.html#constructor
            autoescape: options.autoescape,
            throwOnUndefined: options.throwOnUndefined,
            trimBlocks: options.trimBlocks,
            lstripBlocks: options.lstripBlocks,
            // Loader specific options
            jinjaCompat: options.jinjaCompat,
            isWindows,
            isAsyncTemplate
        });
        callback(null, `
            ${getRuntimeImport(this)}
            ${getTemplateDependenciesImport(this, dependencies)}
            ${globalsImports(this)}
            ${extensionsImports(this)}
            ${filtersImports(this)}
            ${getAssets(assetsUUID).imports(this)}
            ${replaceAssets(precompiled, assetsUUID)}

            exports = module.exports = function nunjucksTemplate(ctx) {
              var nunjucks = runtime(
                ${envOptions},
                ${TEMPLATE_DEPENDENCIES}
              );

              if (nunjucks.isAsync()) {
                return nunjucks.renderAsync(${resourcePathString}, ctx);
              }
            
              return nunjucks.render(${resourcePathString}, ctx);
            };

            exports.__nunjucks_precompiled_template__ = ${TEMPLATE_DEPENDENCIES}.templates[${resourcePathString}];
            exports.${TEMPLATE_DEPENDENCIES} = ${TEMPLATE_DEPENDENCIES};
        `);
    }, function(error) {
        if (error.code === ERROR_MODULE_NOT_FOUND &&
            error.message.includes("'glob'")) {
            return callback(new Error(
                'Attempt to use dynamic assets ' +
                'without optional "glob" dependency installed'
            ));
        }

        callback(error);
    });
}
