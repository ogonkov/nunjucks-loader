import type {UsageMatcher} from '../ast/types';

import type {ItemFinder} from './types';

/**
 * @template T, U
 * @param {readonly T[]}                         list
 * @param {function(U): function(T): boolean} callback
 * @returns {function(U): (T | undefined)}
 */
export function toListItem<T, U>(
    list: readonly T[],
    callback: UsageMatcher<U, T>,
): ItemFinder<T, U> {
    /**
     * @template T, U
     * @param {U} item
     * @returns {T | undefined}
     */
    return function findItem(item: U): T | undefined {
        return list.find(callback(item));
    };
}
