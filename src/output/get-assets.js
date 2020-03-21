import {getArgs} from './assets';

/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports() {
        const assetsImports = assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);

            const importInvocation = assetImport.startsWith('"') ?
                `function(${args.join()}) {
                    return require(${assetImport});
                }` :
                `require(${JSON.stringify(assetImport)})`;

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
