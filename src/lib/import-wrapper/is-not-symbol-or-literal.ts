import {ImportLiteral} from './ImportLiteral';
import {isSymbol} from './is-symbol';
import type {Predicate, UnknownFunction} from './types';


function and(...fns: Predicate[]) {
    return function(...args: unknown[]) {
        return fns.every(fn => fn(...args));
    }
}

function not(fn: UnknownFunction) {
    return function isNot(...args: unknown[]) {
        return !(fn(...args));
    }
}

function isLiteral(value: unknown): value is ImportLiteral {
    return value instanceof ImportLiteral;
}

export const isNotSymbolOrLiteral = and(not(isLiteral), not(isSymbol));
