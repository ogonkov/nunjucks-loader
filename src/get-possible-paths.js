import path from 'path';
import {unquote} from './utils/unquote';

function getFilePath(searchPath, possiblePath) {
    const [firstPart, ...restParts] = possiblePath.split(' + ');
    const filePath = path.resolve(searchPath, unquote(firstPart));

    return restParts.length > 0 ?
        `${[`"${filePath}"`, ...restParts].join(' + ')}` : filePath;
}

/**
 * @param {string[]} paths
 * @param {string[]} searchPaths
 * @returns {Array.<[string, array]>}
 */
export function getPossiblePaths(paths, searchPaths) {
    return paths.map(function(possiblePath) {
        return [
            possiblePath,
            searchPaths.map((searchPath) => [
                path.resolve(searchPath),
                getFilePath(searchPath, possiblePath)
            ]).filter(function([basePath, filePath]) {
                return unquote(filePath).startsWith(basePath);
            }).map(function([, filePath]) {
                return filePath;
            })
        ];
    });
}
