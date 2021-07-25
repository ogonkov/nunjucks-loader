import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {toVar} from '../utils/to-var';

import {getDynamicImport} from './get-dynamic-import';


/**
 * @param {Array.<ImportWrapper[]>} assets
 * @returns {{imports: function(Object, boolean): string}}
 */
export function getAssets(assets) {
    function imports(loaderContext, esModule) {
        return assets.map(function([assetPath, assetImport]) {
            const uuid = assetPath.getHash();
            const isDynamicImport = assetImport.isDynamic();
            const importVar = toVar(
                `${IMPORTS_PREFIX}_asset_${uuid}`
            );
            const importInvocation = getDynamicImport(
                loaderContext,
                assetPath,
                assetImport,
                {
                    esModule,
                    importVar
                }
            );


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
