import {stringifyRequest} from 'loader-utils';

import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';

import {getModuleOutput} from './get-module-output';

export function getExtensions(extensions) {
    function imports(loaderContext, esModule) {
        return extensions.map(([name, importPath]) => {
            const importVar = toVar(`${IMPORTS_PREFIX}_ext_${name}`);
            const importStatement = getImportStr(
                stringifyRequest(loaderContext, importPath),
                esModule
            )(importVar);

            return `
            ${importStatement}
            ${TEMPLATE_DEPENDENCIES}.extensions['${name}'] = {
                module: ${getModuleOutput(importVar)}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
