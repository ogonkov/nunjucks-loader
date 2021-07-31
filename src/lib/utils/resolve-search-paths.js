import path from 'path';

import {resolve} from '../import-wrapper/resolve';


/**
 * @param {ImportWrapper} possiblePath
 * @param {string[]}      searchPaths
 * @returns {ImportWrapper[]}
 */
export function resolveSearchPaths(possiblePath, searchPaths) {
    return searchPaths.map((searchPath) => [
        path.resolve(searchPath),
        resolve(searchPath, possiblePath)
    ]).filter(function([basePath, filePath]) {
        return filePath.startsWith(basePath);
    }).map(function([, filePath]) {
        return filePath;
    })
}
