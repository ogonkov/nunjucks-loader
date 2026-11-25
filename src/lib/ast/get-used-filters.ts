import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';
import type {NamedAddon} from './types';

export function getUsedFilters<T extends NamedAddon>(nodes: nunjucks.nodes.Root, instances: T[]) {
    return getUsagesOf(nunjucks.nodes.Filter, nodes)(
        instances, ({name}) => (
            ({name: filterName}) => {
                if (name === null) {
                    throw new TypeError('Filter node has no name');
                }

                return filterName === name.value;
            }
        )
    );
}
