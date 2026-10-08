type ModuleValue<T> = T extends {default: infer Value}
    ? Value | (Extract<false | 0 | 0n | '' | null | undefined, Value> extends never ? never : T)
    : T;

/**
 * Unwrap a truthy default export, otherwise return the imported value itself.
 *
 * A present but falsy default export, such as false, zero, or an empty string,
 * leaves the original imported value unchanged. Null and undefined inputs
 * are returned unchanged as well.
 *
 * @template Module
 * @param {Module} importedSymbol
 *     Imported module namespace or directly exported value.
 * @returns {*}
 *     The default export when truthy, otherwise the original imported value.
 */
export function getModule<T>(importedSymbol: T): ModuleValue<T> {
    return ((importedSymbol as {default?: unknown} | null | undefined)?.default || importedSymbol) as ModuleValue<T>;
}
