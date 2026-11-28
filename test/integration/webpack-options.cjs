const path = require('node:path');

module.exports = () => {
    const consumer = process.cwd();
    const fixture = file => path.join(consumer, 'test/fixtures', file);
    const assetsPaths = [fixture('django_project/app_example/static')];
    const groups = [
        {
            name: 'basic',
            options: {},
            entry: {
                single: fixture('single.njk'),
                child: fixture('child.njk'),
                inheritance: fixture('inheritance.njk'),
                multipleIncludes: fixture('multiple-same-includes.njk'),
                builtinFilters: fixture('builtin-filters.njk'),
                builtinTags: fixture('builtin-tags.njk'),
                macro: fixture('macro.njk'),
            }
        },
        {
            name: 'jinja',
            options: {jinjaCompat: true},
            entry: {
                jinja: fixture('jinja-syntax.njk'),
            }
        },
        {
            name: 'nonRelative',
            options: {searchPaths: [fixture('django_project/app_example/templates'), consumer]},
            entry: {
                nonRelative: fixture('django_project/app_example/templates/main/main.njk'),
            }
        },
        {
            name: 'warnings',
            options: {assetsPaths},
            entry: {
                warnings: fixture('templates/dynamic.njk'),
            }
        },
        {
            name: 'globals',
            options: {globals: {foobar: fixture('globals/globals.js')}},
            entry: {
                globalsBase: fixture('globals/base.njk'),
                globalsChild: fixture('globals/child.njk'),
                globalsMultiple: fixture('globals/multiple.njk'),
            }
        },
        {
            name: 'extensions',
            options: {extensions: {RemoteExtension: fixture('extensions/RemoteExtension.js')}},
            entry: {
                extensionsBase: fixture('extensions/base.njk'),
                extensionsChild: fixture('extensions/child.njk'),
                extensionsMultiple: fixture('extensions/multiple.njk'),
            }
        },
        {
            name: 'asyncExtensions',
            options: {extensions: {RemoteExtension: fixture('extensions/RemoteAsyncExtension.js')}},
            entry: {
                asyncExtensions: fixture('extensions/multiple.njk'),
            }
        },
        {
            name: 'filters',
            options: {filters: {foo: fixture('filters/foo-filter.js')}},
            entry: {
                filtersSingle: fixture('filters/single.njk'),
                filtersMultiple: fixture('filters/multiple.njk'),
                filtersChildren: fixture('filters/children.njk'),
            }
        },
        {
            name: 'asyncFilters',
            options: {filters: {foo: fixture('filters/foo-filter-async.js')}},
            entry: {
                asyncFilters: fixture('filters/children.njk'),
            }
        },
        {
            name: 'assets',
            options: {assetsPaths},
            entry: {
                assetStatic: fixture('assets/template.njk'),
                assetStaticAs: fixture('assets/template-as.njk'),
                assetDynamic: fixture('assets/dynamic.njk'),
                assetDynamicTrailingSlash: fixture('assets/dynamic-trailing-slash.njk'),
                assetDynamicAs: fixture('assets/dynamic-as.njk'),
                assetVariables: fixture('assets/dynamic-variable.njk'),
            }
        },
    ];

    return [false, true].flatMap(esModule => groups.map(group => ({
        name: `${esModule ? 'esm' : 'cjs'}-${group.name}`,
        mode: 'development',
        devtool: false,
        target: 'node',
        context: path.join(consumer, 'test'),
        entry: group.entry,
        output: {
            path: path.join(consumer, 'dist', esModule ? 'esm' : 'cjs'),
            filename: '[name].cjs',
            assetModuleFilename: 'bundles/[path][name][ext]',
            library: {type: 'commonjs2', export: esModule ? 'default' : undefined}
        },
        module: {
            rules: [{
                test: /\.njk$/,
                use: {
                    loader: 'simple-nunjucks-loader',
                    options: {esModule, searchPaths: [consumer], ...group.options}
                }
            }, {
                test: /\.(css|txt|md)$/,
                type: 'asset/resource'
            }]
        },
        stats: {all: false, warnings: true, errors: true}
    })));
};
