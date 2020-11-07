import path from 'path';

import {hasAsyncTags} from './ast/has-async-tags';
import {TEMPLATE_DEPENDENCIES} from './constants';
import {getModuleOutput} from './output/get-module-output';
import {getTemplateImports} from './output/get-template-imports';
import {toAssetsUUID} from './output/to-assets-uuid';
import {configureEnvironment} from './precompile/configure-environment';
import {getUsedDependencies} from './precompile/get-used-dependencies';
import {loadDependencies} from './precompile/load-dependencies';
import {precompileToLocalVar} from './precompile/precompile-to-local-var';
import {ASSETS_KEY} from './static-extension/contants';


const isWindows = process.platform === 'win32';
const staticExtensionPath = path.join(
    __dirname,
    'static-extension',
    'get-static-extension.js'
);

export async function doTransform(source, loaderContext, {
    resourcePathImport,
    options,
    normalizedSearchPaths
}) {
    const nunjucksOptions = {
        // https://mozilla.github.io/nunjucks/api.html#configure
        autoescape: options.autoescape,
        throwOnUndefined: options.throwOnUndefined,
        trimBlocks: options.trimBlocks,
        lstripBlocks: options.lstripBlocks,
        tags: options.tags
    };

    const {
        nodes,
        extensions: extensionsInstances,
        filters: filtersInstances
    } = await loadDependencies(
        source,
        {
            StaticExtension: staticExtensionPath,
            ...options.extensions
        },
        options.filters,
        nunjucksOptions
    );
    const {
        assets,
        dependencies,
        globals,
        extensions,
        filters
    } = await getUsedDependencies(
        nodes,
        extensionsInstances,
        filtersInstances,
        {
            ...options,
            searchPaths: normalizedSearchPaths
        }
    );
    const isAsyncTemplate = hasAsyncTags(nodes);

    const assetsUUID = toAssetsUUID(assets);
    const resourcePathString = JSON.stringify(resourcePathImport);
    const envOptions = JSON.stringify({
        ...nunjucksOptions,
        // Loader specific options
        jinjaCompat: options.jinjaCompat,
        isWindows,
        isAsyncTemplate
    });

    const outputImports = getTemplateImports(loaderContext, options.esModule, {
        assets: assetsUUID,
        dependencies,
        extensions,
        filters,
        globals
    });

    const env = configureEnvironment({
        searchPaths: normalizedSearchPaths,
        options: nunjucksOptions,
        extensions: extensionsInstances,
        filters: filtersInstances
    });
    const outputPrecompiled = precompileToLocalVar(source, resourcePathImport, env);

    const outputExport = options.esModule ?
        'export default' :
        'exports = module.exports =';

    return `
        ${outputImports}
        ${outputPrecompiled}

        function nunjucksTemplate(ctx = {}) {
          var nunjucks = (${getModuleOutput('runtime')})(
            ${envOptions},
            ${TEMPLATE_DEPENDENCIES}
          );

          ctx.${ASSETS_KEY} = ${TEMPLATE_DEPENDENCIES}.assets;

          if (nunjucks.isAsync()) {
            return nunjucks.renderAsync(${resourcePathString}, ctx);
          }
        
          return nunjucks.render(${resourcePathString}, ctx);
        };

        nunjucksTemplate.__nunjucks_precompiled_template__ = ${TEMPLATE_DEPENDENCIES}.templates[${resourcePathString}];
        nunjucksTemplate.${TEMPLATE_DEPENDENCIES} = ${TEMPLATE_DEPENDENCIES};

        ${outputExport} nunjucksTemplate;
    `;
}
