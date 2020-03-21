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
        assetsPaths = '.',
        globals = {},
        extensions = {},
        filters = {}
    } = loaderOptions;

    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        jinjaCompat,
        tags,
        searchPaths,
        assetsPaths,
        globals,
        extensions,
        filters
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
