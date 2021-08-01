import {hasAsyncTags} from './ast/has-async-tags';
import {getLoaderOutput} from './output/get-loader-output';
import {getTemplateImports} from './output/get-template-imports';
import {configureEnvironment} from './precompile/configure-environment';
import {getAST} from './precompile/get-ast';
import {getUsedDependencies} from './precompile/get-used-dependencies';
import {precompileToLocalVar} from './precompile/precompile-to-local-var';
import {wrapAddons} from './precompile/wrap-addons';


const staticExtensionPath = require.resolve(
    '../public/static-extension/get-static-extension'
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
        tags: options.tags,
        dev: options.dev ?? loaderContext.mode === 'development'
    };

    const wrappedAddons = wrapAddons(
        {
            StaticExtension: staticExtensionPath,
            ...options.extensions
        },
        options.filters,
        options.globals,
        {
            loaderContext,
            es: options.esModule
        }
    );
    const nodes = await getAST(
        source,
        wrappedAddons.extensions,
        nunjucksOptions
    );
    const usedDependencies = await getUsedDependencies(
        loaderContext,
        nodes,
        wrappedAddons.extensions,
        wrappedAddons.filters,
        wrappedAddons.globals,
        {
            ...options,
            searchPaths: normalizedSearchPaths
        }
    );

    const outputImports = await getTemplateImports(loaderContext, options.esModule, {
        assets: usedDependencies.assets,
        dependencies: usedDependencies.templates,
        extensions: usedDependencies.extensions,
        filters: usedDependencies.filters,
        globals: usedDependencies.globals
    });

    const env = await configureEnvironment({
        searchPaths: normalizedSearchPaths,
        options: nunjucksOptions,
        extensions: wrappedAddons.extensions,
        filters: wrappedAddons.filters
    });
    const outputPrecompiled = precompileToLocalVar(source, resourcePathImport, env);

    const outputExport = options.esModule ?
        'export default' :
        'exports = module.exports =';

    const envOptions = JSON.stringify({
        ...nunjucksOptions,
        // Loader specific options
        jinjaCompat: options.jinjaCompat,
        isAsyncTemplate: hasAsyncTags(nodes)
    });

    return getLoaderOutput({
        templateImport: JSON.stringify(resourcePathImport),
        imports: outputImports,
        precompiled: outputPrecompiled,
        envOptions,
        defaultExport: outputExport
    });
}
