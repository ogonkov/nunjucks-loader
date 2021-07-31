import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

/**
 *
 * @param {string} source
 * @param {AddonWrapper[]} extensions
 * @param {NunjucksOptions} options
 * @returns {Promise<nunjucks.nodes.Root>}
 */
export async function getAST(source, extensions, options) {
    await addonsLoader(extensions);

    return getNodes(
        source,
        extensions.map(({instance}) => instance),
        options
    );
}
