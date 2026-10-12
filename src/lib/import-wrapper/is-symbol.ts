import {ImportSymbol} from './ImportSymbol';


export function isSymbol(value: unknown): value is ImportSymbol {
    return value instanceof ImportSymbol;
}
