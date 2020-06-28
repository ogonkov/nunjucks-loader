import {stringifyRequest} from 'loader-utils';
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
            __nunjucks_module_dependencies__.extensions['${name}'] = {
                module: ${getModuleOutput(importVar)}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
