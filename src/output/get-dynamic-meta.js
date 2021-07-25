import {TEMPLATE_DEPENDENCIES} from '../constants';


export function getDynamicMeta(assetPath, assetImport, {
    metaKey,
    importVar
}) {
    const isDynamicImport = assetImport.isDynamic();
    const uuid = assetPath.getHash();

    return `${TEMPLATE_DEPENDENCIES}.${metaKey}['${uuid}'] = {
        path: ${isDynamicImport ?
            assetPath.toRegExp().toString() :
            JSON.stringify(assetPath.toString())
        },
        module: ${importVar}
    };`
}
