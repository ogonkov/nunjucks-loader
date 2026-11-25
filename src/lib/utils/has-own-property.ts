export function hasOwnProperty<T extends object>(object: T, key: PropertyKey): key is keyof T {
    return Object.prototype.hasOwnProperty.call(object, key);
}
