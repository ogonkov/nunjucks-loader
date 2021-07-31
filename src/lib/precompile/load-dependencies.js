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
 * @returns {Promise<{filters: InstancesList, extensions: InstancesList, nodes: nunjucks.nodes.Root}>}
 */
export async function loadDependencies(extensions, filters) {
    const [_extensions, _filters] = [
        getAddonsMeta(Object.entries(extensions), 'extensions'),
        getAddonsMeta(Object.entries(filters), 'filters')
    ];

    await addonsLoader(_extensions);
    await addonsLoader(_filters);

    return {
        extensions: _extensions,
        filters: _filters
    };
}
