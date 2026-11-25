import type {nodes} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {ImportWrapper} from '../import-wrapper/ImportWrapper';
import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';
import {isUniqueTemplate} from '../utils/is-unique-template';

import {getDependenciesTemplates} from './get-dependencies-templates';
import type {TemplateImport, TemplatePaths} from './types';


/**
 * Find the first existing path
 */
async function filterPaths([path, paths]: TemplatePaths): Promise<TemplateImport> {
    try {
        const importPath = await getFirstExistedPath(paths);
        return [path, importPath];
    } catch {
        throw new Error(`Template "${path}" not found`);
    }
}


function filterUniqueTemplates(templates: TemplateImport[]) {
    return templates.filter(isUniqueTemplate);
}

export function getTemplatesImports(loaderContext: LoaderContext<unknown>, nodes: nodes.Root, searchPaths: string[]) {
    const templateDeps = getDependenciesTemplates(nodes).filter(function(dep): dep is ImportWrapper {
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
