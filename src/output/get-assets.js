import {stringifyRequest} from 'loader-utils';

import {getArgs} from './assets';

/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports(loaderContext) {
        const assetsImports = assets.map(function([uuid, assetPath, assetImport]) {
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

            const importInvocation = isDynamicImport ?
                `function(${args.join()}) {
                    return require(${importPath});
                }` :
                `require(${importPath})`;

            return `_templateAssets['${uuid}'] = ${importInvocation};`;
        }).join('');

        return `
            var _templateAssets = {};
            
            ${assetsImports}
        `;
    }

    return {
        imports
    };
}
