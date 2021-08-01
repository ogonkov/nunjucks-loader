import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';

/**
 * Filter list of globals
 *
 * @param {nunjucks.nodes.Root}     nodes
 * @param {AddonWrapper[]} globals
 * @returns {AddonWrapper[]}
 */
export function getUsedGlobals(nodes, globals) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        globals, ({name: globalName}) => ({name}) => (
            globalName.value === name
        )
    );
}
