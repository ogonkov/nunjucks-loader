import {getOptions} from 'loader-utils';
import validate from 'schema-utils';

import schema from './schema';

export function getLoaderOptions(loader, callback) {
    let loaderOptions;

    try {
        loaderOptions = getOptions(loader);
    } catch (e) {
        callback(e);
    }

    try {
        validate(schema, loaderOptions, {
            name: 'Simple Nunjucks Loader',
            baseDataPath: 'options'
        });
    } catch (e) {
        callback(e);

        return null;
    }

    for (const key in schema.properties) {
        if (!Object.prototype.hasOwnProperty.call(schema.properties, key) ||
            key in loaderOptions) {
            continue;
        }

        const schemaProp = schema.properties[key];
        if (!('default' in schemaProp)) {
            continue;
        }

        loaderOptions[key] = schemaProp['default'];
    }

    return loaderOptions;
}
