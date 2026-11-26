import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';


/**
 * @param {nunjucks.nodes.FunCall} functionNode
 * @returns {function(AddonWrapper): boolean}
 */
function getFunctionNodeMatcher(functionNode) {
    /**
     * @param {AddonWrapper} addon
     * @returns {boolean}
     */
    function isSameFunction(addon) {
        return functionNode.name.value === addon.name;
    }

    return isSameFunction;
}

/**
 * Filter list of globals
 *
 * @param {nunjucks.nodes.Root}     nodes
 * @param {AddonWrapper[]} globals
 * @returns {AddonWrapper[]}
 */
export function getUsedGlobals(nodes, globals) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        globals,
        getFunctionNodeMatcher
    );
}
