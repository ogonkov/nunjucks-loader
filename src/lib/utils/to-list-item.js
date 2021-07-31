/**
 * @template TNode
 * @param {TNode[]}                   list
 * @param {function(TNode): function} callback
 * @returns {function(Object<TNode>): ?TNode}
 */
export function toListItem(list, callback) {
    /**
     * @template TNode
     * @param {Object<TNode>} item
     * @returns {?TNode}
     */
    function findItem(item) {
        return list.find(callback(item));
    }

    return findItem;
}
