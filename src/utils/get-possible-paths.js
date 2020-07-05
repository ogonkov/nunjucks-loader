import {resolveSearchPaths} from './resolve-search-paths';

/**
 * @param {string[]} paths
 * @param {string[]} searchPaths
 * @returns {Array.<[string, string[]]>}
 */
export function getPossiblePaths(paths, searchPaths) {
    return paths.map(function(possiblePath) {
        return [
            possiblePath,
            resolveSearchPaths(possiblePath, searchPaths)
        ];
    });
}
