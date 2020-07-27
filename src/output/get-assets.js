import {stringifyRequest} from 'loader-utils';

import {getArgs} from './assets';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';
import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getDynamicPathRegexp} from './get-dynamic-path-regexp';

/**
 * @param {Array.<string[]>} assets
 * @returns {{imports: function(Object, boolean): string}}
 */
export function getAssets(assets) {
    function imports(loaderContext, esModule) {
        return assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);
            const isDynamicImport = assetImport.startsWith('"');

            let importPath;
            if (isDynamicImport) {
                importPath = assetImport.split(' + ').map(
                    function(part) {
                        if (part.startsWith('"')) {
                            let nextPart = stringifyRequest(
                                loaderContext,
                                part.replace(/^"|"$/g, '')
                            );

                            if (!nextPart.endsWith('/"') && part.endsWith('/"')) {
                                nextPart = nextPart.replace(/"$/, '/"');
                            }

                            return nextPart;
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
                    return ${getImportStr(importPath, esModule, true)()}
                };` :
                `${getImportStr(importPath, esModule)(importVar)}`;

            return `
            ${importInvocation}
            ${TEMPLATE_DEPENDENCIES}.assets['${uuid}'] = {
              path: ${isDynamicImport ?
                getDynamicPathRegexp(assetPath).toString() :
                JSON.stringify(assetPath)
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
