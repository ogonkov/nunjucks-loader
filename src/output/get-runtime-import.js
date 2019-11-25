import {stringifyRequest} from 'loader-utils';
import path from 'path';

export function getRuntimeImport() {
    return `var runtime = require(${stringifyRequest(
        this,
        `${path.resolve(path.join(__dirname, 'runtime.js'))}`
    )});`
}
