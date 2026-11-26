import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

import type {ASTExtensions, ASTOptions} from './types';


/**
 *
 * @param {string} source
 * @param {AddonWrapper[]} extensions
 * @param {NunjucksOptions} options
 * @returns {Promise<nunjucks.nodes.Root>}
 */
export async function getAST(source: string, extensions: ASTExtensions, options?: ASTOptions) {
    const loadedExtensions = await addonsLoader(extensions);

    return getNodes(
        source,
        loadedExtensions.map(({instance}) => instance),
        options
    );
}
