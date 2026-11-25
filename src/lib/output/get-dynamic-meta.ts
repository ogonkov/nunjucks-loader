import {TEMPLATE_DEPENDENCIES} from '../constants';
import type {ImportWrapper} from '../import-wrapper/ImportWrapper';

import type {DynamicMetaOptions} from './types';



export function getDynamicMeta(assetPath: ImportWrapper, assetImport: ImportWrapper, {
    metaKey,
    importVar,
    depsKey
}: DynamicMetaOptions) {
    const isDynamicImport = assetImport.isDynamic();

    return `${TEMPLATE_DEPENDENCIES}.${metaKey}['${depsKey}'] = {
        path: ${isDynamicImport ?
            assetPath.toRegExp().toString() :
            JSON.stringify(assetPath.toString())
        },
        module: ${importVar}
    };`
}
