import path from 'path';

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
                path.resolve(searchPath, possiblePath)
            ]).filter(function([basePath, filePath]) {
                return filePath.startsWith(basePath);
            }).map(function([, filePath]) {
                return filePath;
            })
        ];
    });
}
