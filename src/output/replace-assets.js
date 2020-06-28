import {toRegExpSource} from '../utils/to-regexp-source';
import {getArgs, isDynamicPath} from './assets';
import {TEMPLATE_ASSETS} from '../constants';


function getAssetReplaceRegExp(path) {
    const isDynamicAsset = isDynamicPath(path);
    const reSource = isDynamicAsset ?
        toRegExpSource(path).split(' \\+ ').map(function(part) {
            if (!part.startsWith('"')) {
                return '([^+]+)';
            }

            return part;
        }).join(' \\+ ') :
        toRegExpSource(`"${path}"`);

    return new RegExp(reSource, 'g');
}

function replaceAssetPath(precompiled, [uuid, path]) {
    const re = getAssetReplaceRegExp(path);
    const argsCount = getArgs(path).length;

    return precompiled.replace(
        re,
        function(match, ...args) {
            const staticArgs = args.slice(0, argsCount);

            return [`${TEMPLATE_ASSETS}['${uuid}']`, ...staticArgs].join();
        }
    );
}

export function replaceAssets(precompiled, assets) {
    if (assets.length === 0) {
        return precompiled;
    }

    return assets.reduce(function(precompiled, asset) {
        return replaceAssetPath(precompiled, asset);
    }, precompiled);
}
