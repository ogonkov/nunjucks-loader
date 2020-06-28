export function getModuleOutput(importedSymbol) {
    return `${importedSymbol} && ${importedSymbol}.default || ${importedSymbol}`;
}
