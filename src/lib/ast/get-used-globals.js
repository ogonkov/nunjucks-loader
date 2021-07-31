import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';

/**
 * @param {nunjucks.nodes.Root}     nodes
 * @param {Object.<string, string>} globals
 * @returns {string[]}
 */
export function getUsedGlobals(nodes, globals) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        Object.entries(globals), ({name: globalName}) => ([name]) => (
            globalName.value === name
        )
    );
}
