import nunjucks from 'nunjucks';


/**
 * @param {Object}   options
 * @param {string[]} options.searchPaths
 * @param {Object}   options.options
 * @param {Array}    options.extensions
 * @param {Array}    options.filters
 * @returns {nunjucks.Environment}
 */
export function configureEnvironment({
    searchPaths,
    options,
    extensions = [],
    filters = []
} = {}) {
    const env = nunjucks.configure(searchPaths, options);

    extensions.forEach(function({name, instance}) {
        env.addExtension(name, instance);
    });

    filters.forEach(function({name, instance}) {
        env.addFilter(name, instance, instance.async === true);
    });

    return env;
}
