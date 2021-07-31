import {getAssets} from './get-assets';
import {getExtensions} from './get-extensions';
import {getFilters} from './get-filters';
import {getGlobals} from './get-globals';
import {getRuntimeImport} from './get-runtime-import';
import {getTemplateDependenciesImport} from './get-template-dependencies-import';

export async function getTemplateImports(loader, esModule, {
    assets,
    dependencies,
    extensions,
    filters,
    globals
}) {
    return `
    ${getRuntimeImport(loader, esModule)}
    ${getTemplateDependenciesImport(loader, esModule, dependencies)}
    ${getGlobals(globals).imports()}
    ${getAssets(assets).imports(loader, esModule)}
    ${getExtensions(extensions).imports()}
    ${await getFilters(filters).imports()}
    `;
}
