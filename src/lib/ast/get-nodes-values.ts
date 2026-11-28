import nunjucks from 'nunjucks';

/**
 * Find nodes of the requested type and extract a value from each matching node.
 *
 * Mapping follows the order returned by findAll. All falsy mapped values are
 * discarded, including false, zero, empty strings, null, undefined, and NaN.
 *
 * @template Node
 * @template Result
 * @param {nunjucks.nodes.Root} nodes
 *     Root of the template syntax tree to search.
 * @param {Function} nodeType
 *     Constructor identifying the kind of syntax node to collect.
 * @param {function(Node): Result} getValue
 *     Extract a value from each matching syntax node.
 * @returns {Result[]}
 *     Truthy mapped values, preserving the order of their matching nodes.
 */
export function getNodesValues<T extends nunjucks.nodes.Node<any, any>, Result>(
    nodes: nunjucks.nodes.Root,
    nodeType: new (...args: any[]) => T,
    getValue: (value: T) => Result
) {
    const nodesOfType = nodes.findAll(nodeType);

    return nodesOfType.map(getValue).filter((value): value is Exclude<Result, undefined> => !!value);
}
