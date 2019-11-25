import {toVar} from '../to-var';

export function getGlobals(globals) {
    function imports() {
        return globals.map(([globalImport, globalPath]) => (
            `var _global_${toVar(globalImport)} = require('${globalPath}');`
        )).join('')
    }

    return {
        imports
    }
}
