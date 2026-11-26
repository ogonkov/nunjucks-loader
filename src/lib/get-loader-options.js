import schema from './schema.json';

/**
 * Read and validate loader options, then apply missing schema defaults.
 *
 * @param {Object} loader Webpack loader context used to obtain the options.
 * @param {function(Error): void} callback Receives an option validation error.
 * @returns {?Object} Validated options, or null when validation fails.
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
