/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports() {
        const assetsImports = assets.map(function([uuid,, assetImport]) {
            return `_templateAssets['${uuid}'] = require('${assetImport}');`;
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
