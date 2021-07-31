import {stringifyRequest} from 'loader-utils';

import {TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';

import {getModuleOutput} from './get-module-output';

export function getExtensions(extensions) {
    function imports(loaderContext, esModule) {
        return extensions.map(({name, importPath, importVar}) => {
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
