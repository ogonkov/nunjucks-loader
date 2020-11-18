import {stringifyRequest} from 'loader-utils';

import {NUNJUCKS_LOADER_IMPORT} from '../constants';
import {getImportStr} from '../utils/get-import-str';


const defaultTemplatesLoader = require.resolve('../WebpackPrecompiledLoader');

export function getTemplateLoaderImport(loaderContext, esModule, loaderClass) {
    const loaderPath = stringifyRequest(
        loaderContext,
        loaderClass || defaultTemplatesLoader
    );

    return `${getImportStr(loaderPath, esModule)(
        NUNJUCKS_LOADER_IMPORT
    )}`;
}
