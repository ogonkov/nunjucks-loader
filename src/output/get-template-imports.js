import {getAssets} from './get-assets';
import {getExtensions} from './get-extensions';
import {getFilters} from './get-filters';
import {getGlobals} from './get-globals';
import {getRuntimeImport} from './get-runtime-import';
import {getTemplateDependenciesImport} from './get-template-dependencies-import';
import {getTemplateLoaderImport} from './get-template-loader-import';

export function getTemplateImports(loader, esModule, {
    loaderClass,
    assets,
    dependencies,
    extensions,
    filters,
    globals
}) {
    return `
    ${getTemplateLoaderImport(loader, esModule, loaderClass)}
    ${getRuntimeImport(loader, esModule)}
    ${getTemplateDependenciesImport(loader, esModule, dependencies)}
    ${getGlobals(globals).imports(loader, esModule)}
    ${getAssets(assets).imports(loader, esModule)}
    ${getExtensions(extensions).imports(loader, esModule)}
    ${getFilters(filters).imports(loader, esModule)}
    `;
}
