import {addonsLoader} from '../addons-wrapper/addons-loader';

import {getAddonsMeta} from './get-addons-meta';


/**
 * @typedef {((string | Function)[])[]} InstancesList
 */

/**
 * Load filters and extensions modules
 *
 * @param {Object.<string, string>} extensions
 * @param {Object.<string, string>} filters
 * @param {Object} options
 * @param {Object} options.loaderContext
 * @param {boolean} options.es
 * @returns {Promise<{filters: InstancesList, extensions: InstancesList, nodes: nunjucks.nodes.Root}>}
 */
export async function loadDependencies(extensions, filters, options) {
    const _extensions = getAddonsMeta(extensions, {
        ...options,
        type: 'extensions',
    });
    const _filters = getAddonsMeta(filters, {
        ...options,
        type: 'filters'
    });

    await Promise.all([
        addonsLoader(_extensions),
        addonsLoader(_filters)
    ]);

    return {
        extensions: _extensions,
        filters: _filters
    };
}
