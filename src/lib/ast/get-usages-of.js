import {toListItem} from '../utils/to-list-item';

/**
 * Filter list of nodes
 *
 * @template TNode
 * @param {nunjucks.nodes.Node} nodeType
 * @param {nunjucks.nodes.Root} nodes
 * @returns {function(TNode[], function(TNode): Function): TNode[]}
 */
export function getUsagesOf(nodeType, nodes) {
    const nodesOfType = nodes.findAll(nodeType);

    /**
     * @template TNode
     * @param {TNode[]} list
     * @param {function(Object<TNode>): function(TNode): boolean} callback
     * @returns {TNode[]}
     */
    function filterNodes(list, callback) {
        return (
            nodesOfType
                .map(toListItem(list, callback))
                .filter(Boolean)
                .filter(({name: addonName}, i, list) => (
                    i === list.findIndex(({name}) => addonName === name)
                ))
        );
    }

    return filterNodes;
}
