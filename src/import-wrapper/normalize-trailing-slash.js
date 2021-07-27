import {unquote} from '../utils/unquote';


/**
 * @param {string} filePath
 * @param {ImportLiteral} firstPart
 * @returns {string}
 */
export function normalizeTrailingSlash(filePath, firstPart) {
    const path = unquote(filePath);
    const string = firstPart.valueOf();
    if ((string === '' || string.endsWith('/')) && !path.endsWith('/')) {
        return `${path}/`;
    }

    return path;
}
