import schema from './schema.json';

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
export function getLoaderOptions(loader, callback) {
    let loaderOptions;

    try {
        loaderOptions = loader.getOptions(schema);
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
