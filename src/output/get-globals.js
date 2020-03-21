import {toVar} from '../utils/to-var';
import {stringifyRequest} from 'loader-utils';

export function getGlobals(globals) {
    function imports(loaderContext) {
        return globals.map(([globalImport, globalPath]) => (
            `
                var _global_${toVar(globalImport)} = require(${
                    stringifyRequest(loaderContext,globalPath)
                });
                __nunjucks_module_dependencies__.globals['${globalImport}'] = {
                    module: _global_${toVar(globalImport)}
                };
            `
        )).join('')
    }

    return {
        imports
    }
}
