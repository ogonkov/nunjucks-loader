import path from 'path';

import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {ImportLiteralOrSymbol, ImportWrapper} from './ImportWrapper';
import {normalizeTrailingSlash} from './normalize-trailing-slash';

/**
 * Joins template import with another path
 */
export function resolve(prependPath: string, templateImport: ImportWrapper) {
    let _templateImport = templateImport.concat();
    let firstPart: string | ImportLiteralOrSymbol = _templateImport.shift();
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
