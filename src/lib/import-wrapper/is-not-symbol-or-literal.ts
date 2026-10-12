import {ImportLiteral} from './ImportLiteral';
import {isSymbol} from './is-symbol';


function and(...fns: ((...args: unknown[])=>boolean)[]) {
    return function(...args: unknown[]) {
        return fns.every(fn => fn(...args));
    }
}

function not(fn: (...args: unknown[]) => unknown) {
    return function isNot(...args: unknown[]) {
        return !(fn(...args));
    }
}

function isLiteral(value: unknown): value is ImportLiteral {
    return value instanceof ImportLiteral;
}

export const isNotSymbolOrLiteral = and(not(isLiteral), not(isSymbol));
