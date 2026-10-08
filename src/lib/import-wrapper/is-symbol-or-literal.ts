import {ImportLiteralOrSymbol} from './ImportWrapper';
import {isNotSymbolOrLiteral} from './is-not-symbol-or-literal';

export function isSymbolOrLiteral(value: unknown): value is ImportLiteralOrSymbol | ImportLiteralOrSymbol[] {
    const assertedValue = ([] as unknown[]).concat(value);
    return !assertedValue.some(isNotSymbolOrLiteral);
}
