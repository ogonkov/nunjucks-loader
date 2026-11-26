import type {Extension, TokenizerOptions} from 'nunjucks';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

/**
 *
 * @param {string} source
 * @param {AddonWrapper<Extension>[]} extensions
 * @param {TokenizerOptions} [options]
 * @returns {Promise<nunjucks.nodes.Root>}
 */
export async function getAST(source: string, extensions: AddonWrapper<Extension>[], options?: TokenizerOptions) {
    const loadedExtensions = await addonsLoader(extensions);

    return getNodes(
        source,
        loadedExtensions.map(({instance}) => instance),
        options
    );
}
