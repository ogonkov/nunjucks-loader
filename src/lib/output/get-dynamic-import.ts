import type {LoaderContext} from 'webpack';

import type {ImportWrapper} from '../import-wrapper/ImportWrapper';
import {stringify} from '../import-wrapper/stringify';
import {getImportStr} from '../utils/get-import-str';
import {stringifyRequest} from '../utils/stringify-request';

import type {DynamicImportOptions} from './types';


export function getDynamicImport(loaderContext: LoaderContext<unknown>, assetPath: ImportWrapper, assetImport: ImportWrapper, {
    esModule,
    importVar
}: DynamicImportOptions = {}) {
    const args = assetImport.toArgs();
    const isDynamicImport = assetImport.isDynamic();

    let importPath;
    if (isDynamicImport) {
        importPath = stringify(loaderContext, assetImport).toString();
    } else {
        importPath = stringifyRequest(loaderContext, assetImport.toString());
    }

    return  isDynamicImport ?
        `const ${importVar} = function(${args.join()}) {
            return ${getImportStr(importPath, esModule, true)()}
        };` :
        `${getImportStr(importPath, esModule)(importVar)}`;
}
