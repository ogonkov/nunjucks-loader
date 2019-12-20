/**
 * @param {Array.<string[]>} assets
 */
export function getAssets(assets) {
    function imports() {
        const assetsImports = assets.map(function([uuid, assetPath]) {
            return `_templateAssets['${uuid}'] = require('${assetPath}');`;
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
