import {stringifyRequest} from 'loader-utils';

import {getArgs} from './assets';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';
import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';

/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports(loaderContext) {
        return assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);
            const isDynamicImport = assetImport.startsWith('"');

            let importPath;
            if (isDynamicImport) {
                importPath = assetImport.split(' + ').map(
                    function(part) {
                        if (part.startsWith('"')) {
                            return stringifyRequest(
                                loaderContext,
                                part.replace(/^"|"$/g, '')
                            );
                        }

                        return part;
                    }
                ).join(' + ');
            } else {
                importPath = stringifyRequest(loaderContext, assetImport);
            }

            const importVar = toVar(
                `${IMPORTS_PREFIX}_asset_${uuid}`
            );
            const importInvocation = isDynamicImport ?
                `const ${importVar} = function(${args.join()}) {
                    return ${getImportStr(importPath, true)()}
                };` :
                `${getImportStr(importPath)(importVar)}`;

            return `
            ${importInvocation}
            ${TEMPLATE_DEPENDENCIES}.assets['${uuid}'] = ${importVar};
            `;
        }).join('');
    }

    return {
        imports
    };
}
