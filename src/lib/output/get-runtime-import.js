import {getImportStr} from '../utils/get-import-str';
import {stringifyRequest} from '../utils/stringify-request';


const runtimeFilePath = require.resolve('../../public/runtime.js');

export function getRuntimeImport(loaderContext, esModule) {
    const runtimePath = stringifyRequest(loaderContext, `${runtimeFilePath}`);

    return `${getImportStr(runtimePath, esModule)('runtime')}`
}
