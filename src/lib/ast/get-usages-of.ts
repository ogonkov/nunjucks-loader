import type {nodes, NodeType} from 'nunjucks';

import {toListItem} from '../utils/to-list-item';

import type {NamedAddon, NodeConstructor, UsageMatcher} from './types';


/**
 * Filter list of nodes
 */
export function getUsagesOf<TNode extends NodeType>(nodeType: NodeConstructor<TNode>, nodes: nodes.Root) {
    const nodesOfType = nodes.findAll(nodeType);

    function filterNodes<TAddon extends NamedAddon>(list: TAddon[], callback: UsageMatcher<TNode, TAddon>) {
        return (
            nodesOfType
                .map(toListItem(list, callback))
                .filter((addon): addon is TAddon => Boolean(addon))
                .filter(({name: addonName}, i, list) => (
                    i === list.findIndex(({name}) => addonName === name)
                ))
        );
    }

    return filterNodes;
}
