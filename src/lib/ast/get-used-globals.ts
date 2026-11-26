import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';
import type {NamedAddon} from './types';

/**
 * @template T
 * @param {nunjucks.nodes.Root}     nodes
 * @param {T[]}                         globals
 * @returns {T[]}
 */
export function getUsedGlobals<T extends NamedAddon>(nodes: nunjucks.nodes.Root, globals: T[]) {
    return getUsagesOf(nunjucks.nodes.FunCall, nodes)(
        globals, ({name: globalName}) => ({name}) => {
            if (globalName === null) {
                throw new TypeError('Function call node has no name');
            }

            return 'value' in globalName && globalName.value === name;
        }
    );
}
