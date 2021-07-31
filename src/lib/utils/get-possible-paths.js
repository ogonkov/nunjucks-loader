import {resolveSearchPaths} from './resolve-search-paths';

/**
 * @param {ImportWrapper[]} paths
 * @param {string[]} searchPaths
 * @returns {Array.<[ImportWrapper, ImportWrapper[]]>}
 */
export function getPossiblePaths(paths, searchPaths) {
    return paths.map(function(possiblePath) {
        return [
            possiblePath,
            resolveSearchPaths(possiblePath, searchPaths)
        ];
    });
}
