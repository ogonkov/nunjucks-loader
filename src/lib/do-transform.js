import {hasAsyncTags} from './ast/has-async-tags';
import {getLoaderOutput} from './output/get-loader-output';
import {getTemplateImports} from './output/get-template-imports';
import {configureEnvironment} from './precompile/configure-environment';
import {getAST} from './precompile/get-ast';
import {getUsedDependencies} from './precompile/get-used-dependencies';
import {loadDependencies} from './precompile/load-dependencies';
import {precompileToLocalVar} from './precompile/precompile-to-local-var';


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

    const {
        extensions: extensionsInstances,
        filters: filtersInstances
    } = loadDependencies(
        {
            StaticExtension: staticExtensionPath,
            ...options.extensions
        },
        options.filters,
        {
            loaderContext,
            es: options.esModule
        }
    );
    const nodes = await getAST(source, extensionsInstances, nunjucksOptions);
    const {
        assets,
        templates: dependencies,
        globals,
        extensions,
        filters
    } = await getUsedDependencies(
        loaderContext,
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

    const outputImports = await getTemplateImports(loaderContext, options.esModule, {
        assets,
        dependencies,
        extensions,
        filters,
        globals
    });

    const env = await configureEnvironment({
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
