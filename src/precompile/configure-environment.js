import nunjucks from 'nunjucks';

import {getModule} from '../public/utils/get-module';

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

    extensions.forEach(function([name,, extensionInstance]) {
        env.addExtension(name, getModule(extensionInstance));
    });

    filters.forEach(function([filterName,, filterInstance]) {
        const module = getModule(filterInstance);

        env.addFilter(filterName, module, module.async === true);
    });

    return env;
}
