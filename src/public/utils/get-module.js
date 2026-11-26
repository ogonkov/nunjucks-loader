/**
 * Unwrap a truthy default export, otherwise return the imported value itself.
 *
 * @template Module
 * @param {Module} importedSymbol Imported module namespace or exported value.
 * @returns {*} The default export when truthy, otherwise the original value.
 */
export function getModule(importedSymbol) {
    return importedSymbol?.default || importedSymbol;
}
