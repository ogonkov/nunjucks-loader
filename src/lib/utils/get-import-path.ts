import {getPathRemover} from './get-path-remover';
import {sortBy} from './sort-by';


const isWindows = process.platform === 'win32';
const sortByLength = sortBy('length');

export function getImportPath(resourcePath: string, searchPaths: string[]) {
    const removeSearchPath = getPathRemover(resourcePath);
    let [importPath] = searchPaths.map(removeSearchPath).sort(sortByLength);

    if (isWindows) {
        importPath = importPath.replace(/\\/g, '/');
    }

    return importPath;
}
