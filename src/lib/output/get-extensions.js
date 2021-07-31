import {TEMPLATE_DEPENDENCIES} from '../constants';

import {getModuleOutput} from './get-module-output';

export function getExtensions(extensions) {
    function imports() {
        return extensions.map(({name, importVar, importStatement}) => {
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
