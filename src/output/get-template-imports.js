import {getRuntimeImport} from './get-runtime-import';
import {getTemplateDependenciesImport} from './get-template-dependencies-import';
import {getGlobals} from './get-globals';
import {getAssets} from './get-assets';
import {getExtensions} from './get-extensions';
import {getFilters} from './get-filters';

export function getTemplateImports(loader, {
    assets,
    dependencies,
    extensions,
    filters,
    globals
}) {
    return `
    ${getRuntimeImport(loader)}
    ${getTemplateDependenciesImport(loader, dependencies)}
    ${getGlobals(globals).imports(loader)}
    ${getAssets(assets).imports(loader)}
    ${getExtensions(extensions).imports(loader)}
    ${getFilters(filters).imports(loader)}
    `;
}
