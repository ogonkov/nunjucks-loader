import {isNotSymbolOrLiteral} from './is-not-symbol-or-literal';


/**
 * @param {string} methodName
 * @param {(ImportLiteralOrSymbol | ImportLiteralOrSymbol[])} value
 */
export function throwNotSymbolOrLiteral(methodName, value) {
    const assertedValue = [].concat(value);
    if (assertedValue.some(isNotSymbolOrLiteral)) {
        throw new TypeError(
            `${methodName}: all parts should be a symbol or literal instances`
        );
    }
}
