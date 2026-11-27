import {ImportLiteral} from './ImportLiteral';
import {getType} from './get-type';
import type {ImportLiteralOrSymbol} from './types';

/**
 * Squash literals and symbols
 */
export function optimizeImportLiterals(importValue: ImportLiteralOrSymbol[]): ImportLiteralOrSymbol[] {
    return importValue.reduce<ImportLiteralOrSymbol[]>(function(importValue, item) {
        const previousItem = importValue.pop();

        if (previousItem === void 0) {
            return [
                ...importValue,
                item
            ];
        }

        const previousType = getType(previousItem);
        const type = getType(item);

        if (previousType !== type || type === 'ImportSymbol') {
            return [
                ...importValue,
                previousItem,
                item
            ];
        }

        const nextItem = `${previousItem.valueOf()}${item.valueOf()}`;
        const nextValue = new ImportLiteral(nextItem);

        return [
            ...importValue,
            nextValue
        ];
    }, []);
}
