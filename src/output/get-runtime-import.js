import {stringifyRequest} from 'loader-utils';
import path from 'path';

export function getRuntimeImport(loaderContext) {
    return `var runtime = require(${stringifyRequest(
        loaderContext,
        `${path.resolve(path.join(__dirname, '..', 'runtime.js'))}`
    )});`
}
