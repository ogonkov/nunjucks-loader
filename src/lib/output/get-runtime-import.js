import path from 'path';

import {stringifyRequest} from 'loader-utils';

import {getImportStr} from '../../utils/get-import-str';

export function getRuntimeImport(loaderContext, esModule) {
    const runtimePath = stringifyRequest(
        loaderContext,
        `${path.resolve(path.join(__dirname, '..', '..', 'public', 'runtime.js'))}`
    );

    return `${getImportStr(runtimePath, esModule)('runtime')}`
}
