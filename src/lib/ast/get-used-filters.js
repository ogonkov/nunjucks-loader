import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';


function getFilterNodeMatcher(filterNode) {
    /**
     * @param {AddonWrapper} addon
     * @returns {boolean}
     */
    function isSameNode(addon) {
        return addon.name === filterNode.name.value;
    }

    return isSameNode;
}

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {AddonWrapper[]}      instances
 * @returns {AddonWrapper[]}
 */
export function getUsedFilters(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.Filter, nodes)(
        instances,
        getFilterNodeMatcher
    );
}
