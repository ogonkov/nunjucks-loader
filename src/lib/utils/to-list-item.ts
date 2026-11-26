/**
 * @template T, U
 * @param {readonly T[]}                         list
 * @param {function(U): function(T): boolean} callback
 * @returns {function(U): (T | undefined)}
 */
export function toListItem<T, U>(
    list: readonly T[],
    callback: (item: U) => (candidate: T) => boolean,
): (item: U) => T | undefined {
    /**
     * @template T, U
     * @param {U} item
     * @returns {T | undefined}
     */
    return function findItem(item: U): T | undefined {
        return list.find(callback(item));
    };
}
