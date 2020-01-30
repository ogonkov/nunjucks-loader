import {toVar} from '../to-var';

export function getGlobals(globals) {
    console.log('getGlobals', globals[0]);

    function imports() {
        return globals.map(([globalImport, globalPath]) => (
            `
                var _global_${toVar(globalImport)} = require('${globalPath}');
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
