import {unquote} from '../utils/unquote';

import type {ImportLiteral} from './ImportLiteral';


export function normalizeTrailingSlash(filePath: string, firstPart: string | ImportLiteral) {
    const path = unquote(filePath);
    const string = firstPart.valueOf();
    if ((string === '' || string.endsWith('/')) && !path.endsWith('/')) {
        return `${path}/`;
    }

    return path;
}
