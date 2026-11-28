import type {LoaderContext} from 'webpack';


import {getAssets} from './get-assets';
import {getExtensions} from './get-extensions';
import {getFilters} from './get-filters';
import {getGlobals} from './get-globals';
import {getRuntimeImport} from './get-runtime-import';
import {getTemplateDependenciesImport} from './get-template-dependencies-import';
import type {TemplateImportsOptions} from './types';

export async function getTemplateImports(loader: LoaderContext<unknown>, esModule: boolean, {
    assets,
    dependencies,
    extensions,
    filters,
    globals
}: TemplateImportsOptions) {
    return `
    ${getRuntimeImport(loader, esModule)}
    ${getTemplateDependenciesImport(loader, esModule, dependencies)}
    ${getGlobals(globals).imports()}
    ${getAssets(assets).imports(loader, esModule)}
    ${getExtensions(extensions).imports()}
    ${await getFilters(filters).imports()}
    `;
}
