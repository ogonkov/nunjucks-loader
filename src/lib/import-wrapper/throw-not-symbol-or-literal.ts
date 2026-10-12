import type {ImportLiteralOrSymbol} from './ImportWrapper';
import {isSymbolOrLiteral} from './is-symbol-or-literal';

export function throwNotSymbolOrLiteral(
    methodName: string,
    value: unknown
): asserts value is ImportLiteralOrSymbol | ImportLiteralOrSymbol[] {
    if (!isSymbolOrLiteral(value)) {
        throw new TypeError(
            `${methodName}: all parts should be a symbol or literal instances`
        );
    }
}
