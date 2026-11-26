/**
 * Create a filter callback that keeps the first occurrence of each item.
 *
 * @template Item, List
 * @param {function(List, Item): number} getIndex
 * @returns {function(Item, number, List): boolean}
 */
export function isUniqueObject(getIndex) {
    return function compareIndexes(item, index, list) {
        return getIndex(list, item) === index;
    }
}
