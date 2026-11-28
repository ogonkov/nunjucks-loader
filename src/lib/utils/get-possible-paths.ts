import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {resolveSearchPaths} from './resolve-search-paths';

/**
 * @param {ImportWrapper[]} paths
 * @param {string[]} searchPaths
 * @returns {Array.<[ImportWrapper, ImportWrapper[]]>}
 */
export function getPossiblePaths(paths: ImportWrapper[], searchPaths: string[]) {
    return paths.map(function(possiblePath): [ImportWrapper, ImportWrapper[]] {
        return [
            possiblePath,
            resolveSearchPaths(possiblePath, searchPaths)
        ];
    });
}
