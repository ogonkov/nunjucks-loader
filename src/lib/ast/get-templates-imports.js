import nunjucks from 'nunjucks';

import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';
import {isUniqueAsset} from '../utils/is-unique-asset';

import {getNodesValues} from './get-nodes-values';
import {getTemplatePath} from './get-template-path';


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

const nodeTypes = [
    nunjucks.nodes.Extends,
    nunjucks.nodes.Include,
    nunjucks.nodes.Import,
    nunjucks.nodes.FromImport
];

/**
 * @param {Object} loaderContext
 * @param {nunjucks.nodes.Root} nodes
 * @param {string[]}            searchPaths
 * @returns {Promise<[string, ImportWrapper][]>}
 */
export function getTemplatesImports(loaderContext, nodes, searchPaths) {
    const templateDeps = getNodesValues(nodes, nodeTypes, getTemplatePath).filter(function(dep) {
        if (dep instanceof Error) {
            loaderContext.emitWarning(dep);

            return false;
        }

        return true;
    }).filter(isUniqueAsset);
    const possiblePaths = getPossiblePaths(templateDeps, searchPaths);
    const resolvedTemplates = possiblePaths.map(filterPaths);

    return Promise.all(resolvedTemplates);
}
