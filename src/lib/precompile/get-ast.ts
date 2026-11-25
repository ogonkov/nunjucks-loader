import type {Extension, TokenizerOptions} from 'nunjucks';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

export async function getAST(source: string, extensions: AddonWrapper<Extension>[], options?: TokenizerOptions) {
    const loadedExtensions = await addonsLoader(extensions);

    return getNodes(
        source,
        loadedExtensions.map(({instance}) => instance),
        options
    );
}
