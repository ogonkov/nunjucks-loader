import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';
import {isUniqueTemplate} from '../utils/is-unique-template';

import {getDependenciesTemplates} from './get-dependencies-templates';


/**
 * Find first existed path
 *
 * @param {string} path
 * @param {ImportWrapper[]} paths
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


function filterUniqueTemplates(templates) {
    return templates.filter(isUniqueTemplate);
}

/**
 * @param {Object} loaderContext
 * @param {nunjucks.nodes.Root} nodes
 * @param {string[]}            searchPaths
 * @returns {Promise<[string, ImportWrapper][]>}
 */
export function getTemplatesImports(loaderContext, nodes, searchPaths) {
    const templateDeps = getDependenciesTemplates(nodes).filter(function(dep) {
        if (dep instanceof Error) {
            loaderContext.emitWarning(dep);

            return false;
        }

        return true;
    });
    const possiblePaths = getPossiblePaths(templateDeps, searchPaths);
    const resolvedTemplates = possiblePaths.map(filterPaths);

    return Promise.all(resolvedTemplates).then(filterUniqueTemplates);
}
