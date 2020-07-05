import {stringifyRequest} from 'loader-utils';
import path from 'path';
import {getImportStr} from '../utils/get-import-str';

export function getRuntimeImport(loaderContext, esModule) {
    const runtimePath = stringifyRequest(
        loaderContext,
        `${path.resolve(path.join(__dirname, '..', 'runtime.js'))}`
    );

    return `${getImportStr(runtimePath, esModule)('runtime')}`
}
