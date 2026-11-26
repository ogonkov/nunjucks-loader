import nunjucks from 'nunjucks';

import {addonsLoader} from '../addons-wrapper/addons-loader';


function configure(templatesPath, opts) {
    return new nunjucks.Environment(
        new nunjucks.FileSystemLoader(templatesPath),
        opts
    );
}

/**
 * @param {Object}   env
 * @param {string[]} env.searchPaths
 * @param {Object}   env.options
 * @param {Array}    env.extensions
 * @param {Array}    env.filters
 * @returns {nunjucks.Environment}
 */
export async function configureEnvironment({
    searchPaths,
    options,
    extensions = [],
    filters = []
} = {}) {
    const env = configure(searchPaths, options);

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
