export function getNodesValues(nodes, nodeType, getValue) {
    const nodesOfType = nodes.findAll(nodeType);

    return nodesOfType.map(getValue).filter(Boolean);
}
