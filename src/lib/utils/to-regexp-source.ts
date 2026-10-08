const reSafeSymbols = /([.*+?^=!:${}()|[\]/\\])/g;

export function toRegExpSource(str: string) {
    return str.replace(reSafeSymbols, '\\$1');
}
