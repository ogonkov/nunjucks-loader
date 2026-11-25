import type {TokenizerOptions} from 'nunjucks';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {addonsLoader} from '../addons-wrapper/addons-loader';
import {getNodes} from '../ast/get-nodes';

export async function getAST(source: string, extensions: AddonWrapper[], options?: TokenizerOptions) {
    await addonsLoader(extensions);

    return getNodes(
        source,
        extensions.map(({instance}) => instance),
        options
    );
}
