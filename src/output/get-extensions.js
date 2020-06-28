import {stringifyRequest} from 'loader-utils';
import {TEMPLATE_DEPENDENCIES} from '../constants';
import {getModuleOutput} from './get-module-output';

export function getExtensions(extensions) {
    function imports(loaderContext) {
        return extensions.map(([name, importPath]) => {
            const importVar = `_extension_${name}`;

            return `
            var ${importVar} = require(${stringifyRequest(
                loaderContext,
                importPath
            )});
            ${TEMPLATE_DEPENDENCIES}.extensions['${name}'] = {
                module: ${getModuleOutput(importVar)}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
