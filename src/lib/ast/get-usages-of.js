import {isUniqueObject} from '../utils/is-unique-object';
import {toListItem} from '../utils/to-list-item';

const isUniqueNode = isUniqueObject(getNodeIndex);

/**
 * @param {nunjucks.nodes.Node[]} list
 * @param {nunjucks.nodes.Node} item
 * @returns {number}
 */
function getNodeIndex(list, item) {
    return list.findIndex(function(anotherItem) {
        return item.name === anotherItem.name;
    });
}

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
                .filter(isUniqueNode)
        );
    }

    return filterNodes;
}
