import schema from './lib/schema.json';

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
