import {stringifyRequest} from 'loader-utils';

import {getArgs} from './assets';

/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports(loaderContext) {
        const assetsImports = assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);

            const importInvocation = assetImport.startsWith('"') ?
                `function(${args.join()}) {
                    return require(${assetImport});
                }` :
                `require(${stringifyRequest(loaderContext, assetImport)})`;

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
