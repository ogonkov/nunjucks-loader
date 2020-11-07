import path from 'path';

import {sortBy} from './sort-by';


const sortByLength = sortBy('length');

/**
 * @param {string}   resourcePath
 * @param {string[]} searchPaths
 * @returns {string}
 */
export function getImportPath(resourcePath, searchPaths) {
    const [importPath] = searchPaths.map((searchPath) => resourcePath
            .replace(path.resolve(searchPath), '')
            .replace(/^\//, '')
        ).sort(sortByLength);

    return importPath;
}
