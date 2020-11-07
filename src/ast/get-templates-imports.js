import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';

import {getDependenciesTemplates} from './get-dependencies-templates';


/**
 * Find first existed path
 *
 * @param {string} path
 * @param {string[]} paths
 * @returns {Promise<string[]>}
 */
async function filterPaths([path, paths]) {
    try {
        const importPath = await getFirstExistedPath(paths);
        return [path, importPath];
    } catch {
        throw new Error(`Template "${path}" not found`);
    }
}

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {string[]}            searchPaths
 * @returns {Promise<[string, string][]>}
 */
export function getTemplatesImports(nodes, searchPaths) {
    const templateDeps = getDependenciesTemplates(nodes);
    const possiblePaths = getPossiblePaths(templateDeps, searchPaths);
    const resolvedTemplates = possiblePaths.map(filterPaths);

    return Promise.all(resolvedTemplates);
}
