import nunjucks from 'nunjucks';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getAddNodeValue} from './get-add-node-value';
import {getNodesValues} from './get-nodes-values';


/**
 * @param {nunjucks.Node} node
 * @returns {Error|ImportWrapper}
 */
function getTemplatePath(node) {
    if (typeof node.template.value !== 'string') {
        const templateImport = getAddNodeValue(node.template);

        return new Error(
            `Dynamic templates expressions is not yet supported. Skipping ${
                templateImport.toString()
            }.`
        );
    }

    return new ImportWrapper().addLiteral(node.template.value);
}

const nodeTypes = [
    nunjucks.nodes.Extends,
    nunjucks.nodes.Include,
    nunjucks.nodes.Import,
    nunjucks.nodes.FromImport
];

/**
 * @param {nunjucks.nodes.Root} nodes
 * @returns {ImportWrapper[]}
 */
export function getDependenciesTemplates(nodes) {
    return getNodesValues(nodes, nodeTypes, getTemplatePath);
}
