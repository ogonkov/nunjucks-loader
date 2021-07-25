import path from 'path';

import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';


/**
 * Joins template import with another path
 *
 * @param {string} prependPath
 * @param {ImportWrapper} templateImport
 */
export function resolve(prependPath, templateImport) {
    let _templateImport = templateImport.concat();
    let firstPart = _templateImport.shift();
    if (firstPart instanceof ImportSymbol) {
        _templateImport.unshift(firstPart);
        firstPart = '';
    }

    let filePath = path.resolve(prependPath, firstPart.valueOf());
    if (
        (firstPart.toString() === '' || firstPart.toString().endsWith('/')) &&
        !filePath.endsWith('/')
    ) {
        filePath = `${filePath}/`;
    }

    _templateImport.unshift(new ImportLiteral(filePath));

    return _templateImport;
}
