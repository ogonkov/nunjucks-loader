import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';


/**
 * @param {nunjucks.nodes.CallExtension} extensionNode
 * @returns {function(AddonWrapper)}
 */
function getExtensionNodeMatcher(extensionNode) {
    const {extName} = extensionNode;

    /**
     * @param {AddonWrapper} addon
     * @returns {boolean}
     */
    function isSameNode(addon) {
        // Sometime `extName` is instance of custom tag
        return addon.name === extName || addon.instance === extName
    }

    return isSameNode;
}

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {AddonWrapper[]}      instances
 * @returns {AddonWrapper[]}
 */
export function getUsedExtensions(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.CallExtension, nodes)(
        instances,
        getExtensionNodeMatcher
    );
}
