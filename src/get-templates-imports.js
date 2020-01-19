import {getDependenciesTemplates} from './ast/get-dependencies-templates';
import {getPossiblePaths} from './get-possible-paths';
import {getFirstExistedPath} from './get-first-existed-path';

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {string[]}            searchPaths
 * @returns {Promise<[string, string][]>}
 */
export function getTemplatesImports(nodes, searchPaths) {
    const templateDeps = getDependenciesTemplates(nodes);
    const possiblePaths = getPossiblePaths(templateDeps, searchPaths);
    const resolvedTemplates = possiblePaths.map(function([path, paths]) {
        return getFirstExistedPath(paths).then(function(importPath) {
            return [path, importPath];
        }, function() {
            throw new Error(`Template "${path}" not found`);
        });
    });

    return Promise.all(resolvedTemplates);
}
