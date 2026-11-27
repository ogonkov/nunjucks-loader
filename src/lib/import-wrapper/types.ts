import type {ImportLiteral} from './ImportLiteral';
import type {ImportSymbol} from './ImportSymbol';

export type Predicate = (...args: unknown[]) => boolean;
export type UnknownFunction = (...args: unknown[]) => unknown;

export type ImportLiteralOrSymbol = ImportLiteral | ImportSymbol;

export type MapCallback = (value: ImportLiteralOrSymbol) => unknown;
