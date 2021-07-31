import {TEMPLATE_DEPENDENCIES} from '../constants';

import {getModuleOutput} from './get-module-output';

export function getGlobals(globals) {
    function imports() {
        return globals.map(({
            name: globalImport,
            importVar,
            importStatement
        }) => {
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
