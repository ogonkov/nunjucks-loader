import path from 'path';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';
import {resolve} from '../import-wrapper/resolve';


export function resolveSearchPaths(possiblePath: ImportWrapper, searchPaths: string[]) {
    return searchPaths.map<[string, ImportWrapper]>((searchPath) => [
        path.resolve(searchPath),
        resolve(searchPath, possiblePath)
    ]).filter(function([basePath, filePath]) {
        return filePath.startsWith(basePath);
    }).map(function([, filePath]) {
        return filePath;
    })
}
