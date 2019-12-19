import {toListItem} from './to-list-item';
import {indexOf} from './index-of';

export function getUsagesOf(nodeType, nodes) {
    const nodesOfType = nodes.findAll(nodeType);

    return function(list, callback) {
        return (
            nodesOfType
                .map(toListItem(list, callback))
                .filter(Boolean)
                .filter(([addonName], i, list) => (
                    i === indexOf(list, ([name]) => addonName === name)
                ))
        );
    }
}
