import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {AddonWrapper[]}      instances
 * @returns {AddonWrapper[]}
 */
export function getUsedFilters(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.Filter, nodes)(
        instances, ({name}) => (
            ({name: filterName}) => filterName === name.value
        )
    );
}
