import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';
import type {NamedAddon} from './types';

/**
 * @param {nunjucks.nodes.Root}     nodes
 * @param {Object.<string, string>} globals
 * @returns {string[]}
 */
export function getUsedGlobals<T extends NamedAddon>(nodes: nunjucks.nodes.Root, globals: T[]) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        globals, ({name: globalName}) => ({name}) => (
            globalName !== null && 'value' in globalName && globalName.value === name
        )
    );
}
