import nunjucks from 'nunjucks';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getAddNodeValue} from './get-add-node-value';


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
    ].flatMap((node) => {
        if (typeof node.template.value !== 'string') {
            const templateImport = getAddNodeValue(node.template);

            return new Error(
                `Dynamic templates expressions is not yet supported. Skipping ${
                    templateImport.toString()
                }.`
            );
        }

        return new ImportWrapper().addLiteral(node.template.value);
    });
}
