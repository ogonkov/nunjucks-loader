export function toListItem<T, U>(
    list: readonly T[],
    callback: (item: U) => (candidate: T) => boolean,
): (item: U) => T | undefined {
    return function findItem(item: U): T | undefined {
        return list.find(callback(item));
    };
}
