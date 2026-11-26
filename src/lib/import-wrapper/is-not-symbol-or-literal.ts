import {ImportLiteral} from './ImportLiteral';
import {isSymbol} from './is-symbol';
import type {Predicate, UnknownFunction} from './types';


function and(...fns: Predicate[]): Predicate {
    return function(...args) {
        return fns.every(fn => fn(...args));
    }
}

function not(fn: UnknownFunction): Predicate {
    return function isNot(...args) {
        return !(fn(...args));
    }
}

function isLiteral(value: unknown): value is ImportLiteral {
    return value instanceof ImportLiteral;
}

export const isNotSymbolOrLiteral = and(not(isLiteral), not(isSymbol));
