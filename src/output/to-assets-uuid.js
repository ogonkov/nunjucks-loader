import uuid from 'uuid/v5';

export function toAssetsUUID(assets) {
    return assets.map(function(assetPath) {
        return [
            uuid(assetPath, uuid.URL),
            assetPath
        ];
    })
}
