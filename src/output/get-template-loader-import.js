import {stringifyRequest} from 'loader-utils';

import {NUNJUCKS_LOADER_IMPORT} from '../constants';
import {getImportStr} from '../utils/get-import-str';


const defaultTemplatesLoader = require.resolve('../WebpackPrecompiledLoader');

export function getTemplateLoaderImport(loaderContext, esModule) {
    const loaderPath = stringifyRequest(
        loaderContext,
        defaultTemplatesLoader
    );

    return `${getImportStr(loaderPath, esModule)(
        NUNJUCKS_LOADER_IMPORT
    )}`;
}
