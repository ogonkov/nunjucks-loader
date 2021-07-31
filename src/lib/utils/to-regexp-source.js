const reSafeSymbols = /([.*+?^=!:${}()|[\]/\\])/g;

/**
 * @param {string} str
 * @returns {string}
 */
export function toRegExpSource(str) {
    return str.replace(reSafeSymbols, '\\$1');
}
