import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {AddonWrapper[]}      instances
 * @returns {AddonWrapper[]}
 */
export function getUsedExtensions(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.CallExtension, nodes)(
        instances, ({extName}) => (({name, instance}) => {
            // Sometime `extName` is instance of custom tag
            return name === extName || instance === extName
        })
    );
}
