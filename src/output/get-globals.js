import {stringifyRequest} from 'loader-utils';
import {getImportStr} from '../utils/get-import-str';
import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {toVar} from '../utils/to-var';
import {getModuleOutput} from './get-module-output';

export function getGlobals(globals) {
    function imports(loaderContext) {
        return globals.map(([globalImport, globalPath]) => {
            const importVar = toVar(`${IMPORTS_PREFIX}_global_${globalImport}`);
            const importStatement = getImportStr(
                stringifyRequest(loaderContext,globalPath)
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
