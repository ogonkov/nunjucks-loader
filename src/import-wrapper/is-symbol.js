import {ImportSymbol} from './ImportSymbol';


export function isSymbol(value) {
    return value instanceof ImportSymbol;
}
