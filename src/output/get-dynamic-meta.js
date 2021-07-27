import {TEMPLATE_DEPENDENCIES} from '../constants';


export function getDynamicMeta(assetPath, assetImport, {
    metaKey,
    importVar,
    depsKey
}) {
    const isDynamicImport = assetImport.isDynamic();

    return `${TEMPLATE_DEPENDENCIES}.${metaKey}['${depsKey}'] = {
        path: ${isDynamicImport ?
            assetPath.toRegExp().toString() :
            JSON.stringify(assetPath.toString())
        },
        module: ${importVar}
    };`
}
