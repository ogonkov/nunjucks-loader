import {stringifyRequest} from 'loader-utils';

import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {stringify} from '../import-wrapper/stringify';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';


/**
 * @param {Array.<ImportWrapper[]>} assets
 * @returns {{imports: function(Object, boolean): string}}
 */
export function getAssets(assets) {
    function imports(loaderContext, esModule) {
        return assets.map(function([uuid, assetPath, assetImport]) {
            const args = assetImport.toArgs();
            const isDynamicImport = assetImport.isDynamic();

            let importPath;
            if (isDynamicImport) {
                importPath = stringify(loaderContext, assetImport).toString();
            } else {
                importPath = stringifyRequest(loaderContext, assetImport.toString());
            }

            const importVar = toVar(
                `${IMPORTS_PREFIX}_asset_${uuid}`
            );
            const importInvocation = isDynamicImport ?
                `const ${importVar} = function(${args.join()}) {
                    return ${getImportStr(importPath, esModule, true)()}
                };` :
                `${getImportStr(importPath, esModule)(importVar)}`;

            return `
            ${importInvocation}
            ${TEMPLATE_DEPENDENCIES}.assets['${uuid}'] = {
              path: ${isDynamicImport ?
                assetPath.toRegExp().toString() :
                JSON.stringify(assetPath.toString())
              },
              module: ${importVar}
            };
            `;
        }).join('');
    }

    return {
        imports
    };
}
