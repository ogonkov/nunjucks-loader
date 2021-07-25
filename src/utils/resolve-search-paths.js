import path from 'path';

import {resolve} from '../import-wrapper/resolve';

function getFilePath(searchPath, possiblePath) {
    return resolve(searchPath, possiblePath);
}

/**
 * @param {ImportWrapper} possiblePath
 * @param {string[]}      searchPaths
 * @returns {ImportWrapper[]}
 */
export function resolveSearchPaths(possiblePath, searchPaths) {
    return searchPaths.map((searchPath) => [
        path.resolve(searchPath),
        getFilePath(searchPath, possiblePath)
    ]).filter(function([basePath, filePath]) {
        return filePath.startsWith(basePath);
    }).map(function([, filePath]) {
        return filePath;
    })
}
