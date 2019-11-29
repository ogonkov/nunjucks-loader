import {toVar} from '../to-var';

export function getGlobals(globals) {
    function imports() {
        return globals.map(([globalImport, globalPath]) => (
            `var _global_${toVar(globalImport)} = require('${globalPath}');`
        )).join('')
    }

    function exports() {
        return `
            [${globals.map(([globalName]) => {
                return `['${globalName}', _global_${toVar(globalName)}]`;
            })}]
        `;
    }

    function moduleExports() {
        return `
            ${globals.map(([globalName]) => (`
                '${globalName}': {
                    module: _global_${toVar(globalName)}
                }
            `)).join(',')}
        `;
    }

    return {
        imports,
        exports,
        moduleExports
    }
}
