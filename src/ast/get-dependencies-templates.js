import nunjucks from 'nunjucks';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

/**
 * @param {nunjucks.nodes.Root} nodes
 * @returns {ImportWrapper[]}
 */
export function getDependenciesTemplates(nodes) {
    const extendsNodes = nodes.findAll(nunjucks.nodes.Extends);
    const includeNodes = nodes.findAll(nunjucks.nodes.Include);
    const importNodes = nodes.findAll(nunjucks.nodes.Import);
    const fromImportNodes = nodes.findAll(nunjucks.nodes.FromImport);

    return [
        ...extendsNodes,
        ...includeNodes,
        ...importNodes,
        ...fromImportNodes
    ].map((node) => new ImportWrapper().addLiteral(node.template.value));
}
