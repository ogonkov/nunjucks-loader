import {getStringBas64Hash} from '../utils/get-string-base64-hash';

export function toAssetsUUID(assets) {
    return assets.map(function([assetPath, assetImport]) {
        return [
            getStringBas64Hash(assetPath),
            assetPath,
            assetImport
        ];
    })
}
