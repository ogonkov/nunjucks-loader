import type {UsageMatcher} from '../ast/types';

import type {ItemFinder} from './types';

/**
 * @template TNode
 * @param {TNode[]}                   list
 * @param {function(TNode): function} callback
 * @returns {function(Object<TNode>): ?TNode}
 */
export function toListItem<T, U>(
    list: readonly T[],
    callback: UsageMatcher<U, T>,
): ItemFinder<T, U> {
    /**
     * @template TNode
     * @param {Object<TNode>} item
     * @returns {?TNode}
     */
    return function findItem(item: U): T | undefined {
        return list.find(callback(item));
    };
}
