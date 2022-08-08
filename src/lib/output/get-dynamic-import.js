import {stringify} from '../import-wrapper/stringify';
import {getImportStr} from '../utils/get-import-str';
import {stringifyRequest} from '../utils/stringify-request';


export function getDynamicImport(loaderContext, assetPath, assetImport, {
    esModule,
    importVar
} = {}) {
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
