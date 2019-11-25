import {toVar} from '../to-var';

export function getGlobalsImport(globals) {
    return globals.map(function([globalImport, globalPath]) {
        return `
               var _global_${toVar(globalImport)} = require('${globalPath}');
           `;
    }).join('')
}
