import path from 'path';

import {unquote} from './unquote';

function getFilePath(searchPath, possiblePath) {
    const [firstPart, ...restParts] = possiblePath.split(' + ');
    let filePath = path.resolve(searchPath, unquote(firstPart));

    if (firstPart.endsWith('/"') && !filePath.endsWith('/')) {
        filePath = `${filePath}/`;
    }

    return restParts.length > 0 ?
        `${[`"${filePath}"`, ...restParts].join(' + ')}` : filePath;
}

/**
 * @param {string}   possiblePath
 * @param {string[]} searchPaths
 * @returns {string[]}
 */
export function resolveSearchPaths(possiblePath, searchPaths) {
    return searchPaths.map((searchPath) => [
        path.resolve(searchPath),
        getFilePath(searchPath, possiblePath)
    ]).filter(function([basePath, filePath]) {
        return unquote(filePath).startsWith(basePath);
    }).map(function([, filePath]) {
        return filePath;
    })
}
