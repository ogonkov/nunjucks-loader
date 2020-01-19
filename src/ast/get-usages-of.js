import {toListItem} from '../utils/to-list-item';
import {indexOf} from '../utils/index-of';

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
     * @param {function(TNode): function} callback
     * @returns {TNode[]}
     */
    function filterNodes(list, callback) {
        return (
            nodesOfType
                .map(toListItem(list, callback))
                .filter(Boolean)
                .filter(([addonName], i, list) => (
                    i === indexOf(list, ([name]) => addonName === name)
                ))
        );
    }

    return filterNodes;
}