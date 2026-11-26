/**
 * Find nodes of the requested type, map their values, and discard falsy results.
 *
 * @template Node, Result
 * @param {nunjucks.nodes.Root} nodes Root of the template syntax tree.
 * @param {Function} nodeType Constructor of the nodes to collect.
 * @param {function(Node): Result} getValue Extract a value from each matching node.
 * @returns {Result[]} Truthy mapped values in traversal order.
 */
export function getNodesValues(nodes, nodeType, getValue) {
    const nodesOfType = nodes.findAll(nodeType);

    return nodesOfType.map(getValue).filter(Boolean);
}
