import {getWrappedAddons} from './get-wrapped-addons';


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
    const _extensions = getWrappedAddons(extensions, {
        ...options,
        type: 'extensions',
    });
    const _filters = getWrappedAddons(filters, {
        ...options,
        type: 'filters'
    });
    const _globals = getWrappedAddons(globals, {
        ...options,
        type: 'globals'
    });

    return {
        extensions: _extensions,
        filters: _filters,
        globals: _globals
    };
}
