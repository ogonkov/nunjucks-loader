import {toRegExpSource} from '../to-regexp-source';

function replaceAssetPath(precompiled, [uuid, path]) {
    const reSource = toRegExpSource(`"${path}"`);
    const re = new RegExp(reSource, 'g');

    return precompiled.replace(
        re,
        `_templateAssets['${uuid}']`
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
