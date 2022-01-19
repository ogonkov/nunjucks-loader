import nunjucks from 'nunjucks';

import {getNodesValues} from './get-nodes-values';
import {getTemplatePath} from './get-template-path';


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
