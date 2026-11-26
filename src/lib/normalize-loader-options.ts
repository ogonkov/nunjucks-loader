import type {NullableLoaderOptions} from './types';
import {hasOwnProperty} from './utils/has-own-property';

export function normalizeLoaderOptions(loaderOptions: NullableLoaderOptions) {
    // Treat explicit nulls as omitted options before applying defaults.
    for (const key in loaderOptions) {
        if (hasOwnProperty(loaderOptions, key) && loaderOptions[key] === null) {
            delete loaderOptions[key];
        }
    }

    const tags = loaderOptions.tags;
    if (tags) {
        for (const key in tags) {
            if (hasOwnProperty(tags, key) && tags[key] === null) {
                delete tags[key];
            }
        }
    }
}
