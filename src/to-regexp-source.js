const reSafeSymbols = /([.*+?^=!:${}()|[\]/\\])/g;

export function toRegExpSource(str) {
    return str.replace(reSafeSymbols, '\\$1');
}
