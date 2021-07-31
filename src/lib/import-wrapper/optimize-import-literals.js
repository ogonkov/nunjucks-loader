import {ImportLiteral} from './ImportLiteral';
import {getType} from './get-type';

/**
 * Squash literals and symbols
 *
 * @param {ImportLiteralOrSymbol[]} importValue
 * @returns {ImportLiteralOrSymbol[]}
 */
export function optimizeImportLiterals(importValue) {
    return importValue.reduce(function(importValue, item) {
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
