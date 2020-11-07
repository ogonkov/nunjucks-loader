export function getModule(importedSymbol) {
    return importedSymbol?.default || importedSymbol;
}
