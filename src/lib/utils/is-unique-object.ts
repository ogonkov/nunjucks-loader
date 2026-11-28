import type {IndexGetter} from './types';

/**
 * Create a filter callback that compares an item's index with a lookup result.
 *
 * The callback keeps an item only when getIndex(list, item) equals its current
 * index. Supply a lookup that returns the first matching index to keep the
 * first occurrence according to the lookup's equality rule.
 *
 * @template Item
 * @template List
 * @param {function(List, Item): number} getIndex
 *     Find the index that should be retained for an item in the supplied list.
 * @returns {function(Item, number, List): boolean}
 *     Filter callback receiving the current item, its index, and the list.
 */
export function isUniqueObject<T, L>(getIndex: IndexGetter<T, L>) {
    return function compareIndexes(item: T, index: number, list: L) {
        return getIndex(list, item) === index;
    }
}
