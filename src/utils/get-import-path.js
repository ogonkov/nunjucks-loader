import {getPathRemover} from './get-path-remover';
import {sortBy} from './sort-by';


const sortByLength = sortBy('length');

/**
 * @param {string}   resourcePath
 * @param {string[]} searchPaths
 * @returns {string}
 */
export function getImportPath(resourcePath, searchPaths) {
    const removeSearchPath = getPathRemover(resourcePath);
    const [importPath] = searchPaths.map(removeSearchPath).sort(sortByLength);

    return importPath;
}
