import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';

/**
 * @template TNode
 * @param {nunjucks.nodes.Root} nodes
 * @param {Array[]}             instances
 * @returns {TNode[]}
 */
export function getUsedFilters(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.Filter, nodes)(
        instances, ({name}) => (
            ([filterName]) => filterName === name.value
        )
    );
}
