import path from 'path';

/**
 * @param {string}   resourcePath
 * @param {string[]} searchPaths
 * @returns {string}
 */
export function getImportPath(resourcePath, searchPaths) {
    const [importPath] = searchPaths.map((searchPath) => resourcePath
            .replace(path.resolve(searchPath), '')
            .replace(/^\//, '')
        ).sort(function(a, b) {
            return a.length - b.length;
        });

    return importPath;
}
