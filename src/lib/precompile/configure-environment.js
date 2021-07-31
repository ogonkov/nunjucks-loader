import nunjucks from 'nunjucks';

import {addonsLoader} from '../addons-wrapper/addons-loader';


/**
 * @param {Object}   options
 * @param {string[]} options.searchPaths
 * @param {Object}   options.options
 * @param {Array}    options.extensions
 * @param {Array}    options.filters
 * @returns {nunjucks.Environment}
 */
export async function configureEnvironment({
    searchPaths,
    options,
    extensions = [],
    filters = []
} = {}) {
    const env = nunjucks.configure(searchPaths, options);

    await Promise.all([
        addonsLoader(extensions),
        addonsLoader(filters)
    ]);
    extensions.forEach(function({name, instance}) {
        env.addExtension(name, instance);
    });

    filters.forEach(function({name, instance}) {
        env.addFilter(name, instance, instance.async === true);
    });

    return env;
}
