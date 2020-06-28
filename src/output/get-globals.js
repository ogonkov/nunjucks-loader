import {toVar} from '../utils/to-var';
import {stringifyRequest} from 'loader-utils';

export function getGlobals(globals) {
    function imports(loaderContext) {
        return globals.map(([globalImport, globalPath]) => {
            const importVar = `_global_${toVar(globalImport)}`;

            return `
            var ${importVar} = require(${
                stringifyRequest(loaderContext, globalPath)
            });
            __nunjucks_module_dependencies__.globals['${globalImport}'] = {
                module: ${importVar}
            };`;
        }).join('')
    }

    return {
        imports
    }
}
