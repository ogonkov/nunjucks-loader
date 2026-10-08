import {stringifyRequest} from '../utils/stringify-request';
import type {LoaderContext} from 'webpack';

import {ImportLiteral} from './ImportLiteral';
import {ImportLiteralOrSymbol, ImportWrapper} from './ImportWrapper';
import {isSymbol} from './is-symbol';
import {normalizeTrailingSlash} from './normalize-trailing-slash';


export function stringify(loaderContext: LoaderContext<unknown>, templateImport: ImportWrapper) {
    function toStringifiedValue(value: ImportLiteralOrSymbol) {
        if (isSymbol(value)) {
            return value;
        }

        let nextValue = stringifyRequest(loaderContext, value.valueOf());
        return new ImportLiteral(normalizeTrailingSlash(nextValue, value));
    }

    return templateImport.map(toStringifiedValue);
}
