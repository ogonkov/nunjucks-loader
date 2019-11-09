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
    const {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags,
        jinjaCompat = false,
        searchPaths = '.',
        globals = {},
        extensions = {}
    } = loaderOptions || {};

    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        jinjaCompat,
        tags,
        searchPaths,
        globals,
        extensions
    };

    try {
        validate(schema, options, {
            name: 'Simple Nunjucks Loader',
            baseDataPath: 'options'
        });
    } catch (e) {
        callback(e);
    }

    return options;
}
