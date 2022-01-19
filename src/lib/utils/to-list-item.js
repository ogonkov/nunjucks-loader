/**
 * @template TNode
 * @param {TNode[]}                                           list
 * @param {function(Object<TNode>): function(TNode): boolean} callback
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
