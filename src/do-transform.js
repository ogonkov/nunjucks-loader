import {hasAsyncTags} from './ast/has-async-tags';
import {getLoaderOutput} from './output/get-loader-output';
import {getTemplateImports} from './output/get-template-imports';
import {configureEnvironment} from './precompile/configure-environment';
import {getUsedDependencies} from './precompile/get-used-dependencies';
import {loadDependencies} from './precompile/load-dependencies';
import {precompileToLocalVar} from './precompile/precompile-to-local-var';


const staticExtensionPath = require.resolve(
    './static-extension/get-static-extension'
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
        templates: dependencies,
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

    const envOptions = JSON.stringify({
        ...nunjucksOptions,
        // Loader specific options
        jinjaCompat: options.jinjaCompat,
        isAsyncTemplate: hasAsyncTags(nodes)
    });

    const outputImports = getTemplateImports(loaderContext, options.esModule, {
        assets,
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

    return getLoaderOutput({
        templateImport: JSON.stringify(resourcePathImport),
        imports: outputImports,
        precompiled: outputPrecompiled,
        envOptions,
        defaultExport: outputExport
    });
}
