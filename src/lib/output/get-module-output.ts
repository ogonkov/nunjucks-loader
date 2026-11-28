export function getModuleOutput(importedSymbol: string) {
    return `${importedSymbol} && ${importedSymbol}.default || ${importedSymbol}`;
}
