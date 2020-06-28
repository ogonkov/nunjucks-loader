import {stringifyRequest} from 'loader-utils';
import {TEMPLATE_DEPENDENCIES} from '../constants';
import {toVar} from '../utils/to-var';
import {getModuleOutput} from './get-module-output';

export function getGlobals(globals) {
    function imports(loaderContext) {
        return globals.map(([globalImport, globalPath]) => {
            const importVar = `_global_${toVar(globalImport)}`;

            return `
            var ${importVar} = require(${
                stringifyRequest(loaderContext, globalPath)
            });
            ${TEMPLATE_DEPENDENCIES}.globals['${globalImport}'] = {
                module: ${getModuleOutput(importVar)}
            };`;
        }).join('')
    }

    return {
        imports
    }
}
