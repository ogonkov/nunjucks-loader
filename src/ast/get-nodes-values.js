/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {nunjucks.Node}       nodeType
 * @param {Function}            getValue
 * @returns {*}
 */
export function getNodesValues(nodes, nodeType, getValue) {
    const nodesOfType = nodes.findAll(nodeType);

    return nodesOfType.map(getValue).filter(Boolean);
}
