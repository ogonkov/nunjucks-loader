import {getStringBase64Hash} from '../utils/get-string-base64-hash';

export function toAssetsUUID(assets) {
    return assets.map(function([assetPath, assetImport]) {
        return [
            getStringBase64Hash(assetPath.toString()),
            assetPath,
            assetImport
        ];
    })
}
