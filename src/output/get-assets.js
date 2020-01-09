/**
 * @param {Array.<string[]>} assets
 */
import {getArgs} from './assets';

export function getAssets(assets) {
    function imports() {
        const assetsImports = assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);

            const importInvocation = assetImport.startsWith('"') ?
                `function(${args.join()}) {
                    return require(${assetImport});
                }` :
                `require('${assetImport}')`;

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
