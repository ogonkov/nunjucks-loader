import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

import {getAddonsMeta} from './get-addons-meta';


/**
 * @typedef {((string | Function)[])[]} InstancesList
 */

/**
 * Load filters and extensions modules
 *
 * @param {string} source
 * @param {Object.<string, string>} extensions
 * @param {Object.<string, string>} filters
 * @param {NunjucksOptions} nunjucksOptions
 * @returns {Promise<{filters: InstancesList, extensions: InstancesList, nodes: nunjucks.nodes.Root}>}
 */
export async function loadDependencies(source, extensions, filters, nunjucksOptions) {
    const [_extensions, _filters] = [
        getAddonsMeta(Object.entries(extensions)),
        getAddonsMeta(Object.entries(filters))
    ];

    await addonsLoader(_extensions);
    await addonsLoader(_filters);

    const nodes = getNodes(
        source,
        _extensions.map(({instance}) => instance),
        nunjucksOptions
    );

    return {
        nodes,
        extensions: _extensions,
        filters: _filters
    };
}
