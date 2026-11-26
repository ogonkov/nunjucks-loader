import type {LoaderContext} from 'webpack';

import {normalizeLoaderOptions} from './normalize-loader-options';
import schema from './schema';
import type {LoaderCallback, NullableLoaderOptions, ResolvedLoaderOptions} from './types';
import {hasOwnProperty} from './utils/has-own-property';

/**
 * Read and validate loader options, then apply missing schema defaults.
 *
 * Existing option keys are preserved. Defaults are assigned to the options
 * object returned by the loader, rather than to a separate copy.
 * If reading or validating options fails, report the error through callback
 * and return null without applying defaults.
 *
 * @param {Object} loader
 *     Webpack loader context whose getOptions method accepts the loader schema.
 * @param {function(Error): void} callback
 *     Callback that receives an error thrown while obtaining the options.
 * @returns {?Object}
 *     Validated options with defaults for missing keys, or null on failure.
 */
export function getLoaderOptions(loader: LoaderContext<NullableLoaderOptions>, callback: LoaderCallback) {
    let loaderOptions: NullableLoaderOptions;

    try {
        loaderOptions = loader.getOptions(schema);
    } catch (e) {
        callback(e as Error);

        return null;
    }

    normalizeLoaderOptions(loaderOptions);

    for (const key in schema.properties) {
        if (!hasOwnProperty(schema.properties, key) ||
            key in loaderOptions) {
            continue;
        }

        const schemaProp = schema.properties[key];
        if (!('default' in schemaProp)) {
            continue;
        }

        Object.assign(loaderOptions, {[key]: schemaProp['default']});
    }

    return loaderOptions as ResolvedLoaderOptions;
}
