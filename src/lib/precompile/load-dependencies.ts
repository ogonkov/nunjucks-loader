import {getAddonsMeta} from './get-addons-meta';
import type {AddonPaths, DependencyOptions} from './types';


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
export function loadDependencies(extensions: AddonPaths, filters: AddonPaths, options: DependencyOptions) {
    const _extensions = getAddonsMeta(extensions, {
        ...options,
        type: 'extensions',
    });
    const _filters = getAddonsMeta(filters, {
        ...options,
        type: 'filters'
    });

    return {
        extensions: _extensions,
        filters: _filters
    };
}
