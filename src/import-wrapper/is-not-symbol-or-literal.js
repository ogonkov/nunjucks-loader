import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';


function and(...fns) {
    return function(...args) {
        return fns.reduce(function(a, b) {
            return a?.(...args) && b(...args);
        });
    }
}

function not(fn) {
    return function isNot(...args) {
        return !(fn(...args));
    }
}

function isLiteral(value) {
    return value instanceof ImportLiteral;
}

function isSymbol(value) {
    return value instanceof ImportSymbol;
}

export const isNotSymbolOrLiteral = and(not(isLiteral), not(isSymbol));
