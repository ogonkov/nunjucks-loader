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
    const [extensionsInstances, filtersInstances] = await Promise.all([
        getAddonsMeta(Object.entries(extensions)),
        getAddonsMeta(Object.entries(filters))
    ]);

    const nodes = getNodes(
        source,
        extensionsInstances.map(([,, ext]) => ext),
        nunjucksOptions
    );

    return {
        nodes,
        extensions: extensionsInstances,
        filters: filtersInstances
    };
}
