import {getAddonsMeta} from './get-addons-meta';


/**
 * @typedef {AddonWrapper[]} InstancesList
 */

/**
 * Wraps addons (extensions, filters, globals) to manage their imports
 *
 * @param {Object.<string, string>} extensions
 * @param {Object.<string, string>} filters
 * @param {Object.<string, string>} globals
 * @param {Object} options
 * @param {Object} options.loaderContext
 * @param {boolean} options.es
 * @returns {Object.<string, InstancesList>}
 */
export function wrapAddons(extensions, filters, globals, options) {
    const _extensions = getAddonsMeta(extensions, {
        ...options,
        type: 'extensions',
    });
    const _filters = getAddonsMeta(filters, {
        ...options,
        type: 'filters'
    });
    const _globals = getAddonsMeta(globals, {
        ...options,
        type: 'globals'
    });

    return {
        extensions: _extensions,
        filters: _filters,
        globals: _globals
    };
}
