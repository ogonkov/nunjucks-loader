export function getModule(importedSymbol) {
    return importedSymbol && importedSymbol.default || importedSymbol;
}
