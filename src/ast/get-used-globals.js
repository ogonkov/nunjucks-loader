import {getUsagesOf} from './get-usages-of';
import nunjucks from 'nunjucks';

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
