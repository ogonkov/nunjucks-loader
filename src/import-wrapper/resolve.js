import path from 'path';

import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {normalizeTrailingSlash} from './normalize-trailing-slash';


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

    const filePath = normalizeTrailingSlash(
        path.resolve(prependPath, firstPart.valueOf()),
        firstPart
    );

    _templateImport.unshift(new ImportLiteral(filePath));

    return _templateImport;
}
