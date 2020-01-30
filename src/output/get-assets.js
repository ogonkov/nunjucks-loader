/**
 * @param {Array.<string[]>} assets
 */
import {getArgs, isDynamic} from './assets';
import {unquote} from '../unquote';

export function getAssets(assets) {
    function imports() {
        const assetsImports = assets.map(function([uuid, assetPath, assetImport]) {
            const args = getArgs(assetPath);

            const importInvocation = assetImport.startsWith('"') ?
                `function(${args.join()}) {
                    return require(${assetImport.split(' + ').map((part) => {
                        if (isDynamic(part)) {
                            return JSON.stringify(unquote(part));
                        }
                        
                        return part;
                    }).join(' + ')});
                }` :
                `require(${JSON.stringify(assetImport)})`;
            console.log('>> invocation:',importInvocation);
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
