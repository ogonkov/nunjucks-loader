import type {nodes} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import type {FilterWrapper} from '../addons-wrapper/FilterWrapper';
import {getAssets} from '../ast/get-assets';
import {getTemplatesImports} from '../ast/get-templates-imports';
import {getUsedExtensions} from '../ast/get-used-extensions';
import {getUsedFilters} from '../ast/get-used-filters';
import {getUsedGlobals} from '../ast/get-used-globals';

import {getAddonsMeta} from './get-addons-meta';
import type {UsedDependenciesOptions} from './types';


export async function getUsedDependencies(
    loaderContext: LoaderContext<unknown>,
    nodes: nodes.Root,
    extensions: AddonWrapper[],
    filters: FilterWrapper[],
    loaderOptions: UsedDependenciesOptions
) {
    const {
        searchPaths,
        assetsPaths,
        globals,
        esModule
    } = loaderOptions;

    const [templates, assets, _globals] = await Promise.all([
        getTemplatesImports(loaderContext, nodes, searchPaths),
        getAssets(nodes, assetsPaths),
        getAddonsMeta(globals, {
            es: esModule,
            type: 'globals',
            loaderContext
        })
    ]);

    return {
        templates,
        globals: getUsedGlobals(nodes, _globals),
        extensions: getUsedExtensions(nodes, extensions),
        filters: getUsedFilters(nodes, filters),
        assets
    };
}
