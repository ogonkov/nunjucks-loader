import {stringifyRequest} from 'loader-utils';

import {getImportStr} from '../../utils/get-import-str';
import {toVar} from '../../utils/to-var';
import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';

import {getModuleOutput} from './get-module-output';

export function getGlobals(globals) {
    function imports(loaderContext, esModule) {
        return globals.map(([globalImport, globalPath]) => {
            const importVar = toVar(`${IMPORTS_PREFIX}_global_${globalImport}`);
            const importStatement = getImportStr(
                stringifyRequest(loaderContext,globalPath),
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
