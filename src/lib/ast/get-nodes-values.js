/**
 * @template TValue
 * @param {nunjucks.nodes.Root}             nodes
 * @param {nunjucks.Node|nunjucks.Node[]}   nodeType
 * @param {function(nunjucks.Node): TValue} getValue
 * @returns {TValue[]}
 */
export function getNodesValues(nodes, nodeType, getValue) {
    const nodesOfType = [].concat(nodeType).flatMap(
        (nodeType) => nodes.findAll(nodeType)
    );

    return nodesOfType.map(getValue).filter(Boolean);
}
