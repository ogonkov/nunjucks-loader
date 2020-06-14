import path from 'path';

import {getRuntimeImport} from './get-runtime-import';
import {getTemplateDependenciesImport} from './get-template-dependencies-import';
import {getGlobals} from './get-globals';
import {getAssets} from './get-assets';
import {getExtensions} from './get-extensions';
import {getFilters} from './get-filters';

export function getTemplateImports(loader, esModule, {
    assets,
    dependencies,
    extensions,
    filters,
    globals
}) {
    const hasAssets = Object.keys(assets).length > 0;
    const _globals = getGlobals(globals.concat(hasAssets ? [
        ['static', path.join(__dirname, '..', 'static.js')]
    ] : []));

    return `
    ${getRuntimeImport(loader, esModule)}
    ${getTemplateDependenciesImport(loader, esModule, dependencies)}
    ${_globals.imports(loader, esModule)}
    ${getAssets(assets).imports(loader, esModule)}
    ${getExtensions(extensions).imports(loader, esModule)}
    ${getFilters(filters).imports(loader, esModule)}
    `;
}
