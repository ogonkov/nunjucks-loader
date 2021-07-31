import {stringifyRequest} from 'loader-utils';

import {TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';

import {getModuleOutput} from './get-module-output';

export function getGlobals(globals) {
    function imports(loaderContext, esModule) {
        return globals.map(({
            name: globalImport,
            importPath: globalPath,
            importVar
        }) => {
            const importStatement = getImportStr(
                stringifyRequest(loaderContext, globalPath),
                esModule
            )(importVar);

            return `
            ${importStatement}
            ${TEMPLATE_DEPENDENCIES}.globals['${globalImport}'] = {
                module: ${getModuleOutput(importVar)}
            };`;
        }).join('')
    }

    return {
        imports
    }
}
