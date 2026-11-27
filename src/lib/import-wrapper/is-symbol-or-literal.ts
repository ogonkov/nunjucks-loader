import {isNotSymbolOrLiteral} from './is-not-symbol-or-literal';
import type {ImportLiteralOrSymbol} from './types';

export function isSymbolOrLiteral(value: unknown): value is ImportLiteralOrSymbol | ImportLiteralOrSymbol[] {
    const assertedValue = ([] as unknown[]).concat(value);
    return !assertedValue.some(isNotSymbolOrLiteral);
}
