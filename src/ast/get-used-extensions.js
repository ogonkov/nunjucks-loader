import {getUsagesOf} from './get-usages-of';
import nunjucks from 'nunjucks';

/**
 * @template TNode
 * @param {nunjucks.nodes.Root} nodes
 * @param {Array[]}             instances
 * @returns {TNode[]}
 */
export function getUsedExtensions(nodes, instances) {
    return getUsagesOf(nunjucks.nodes.CallExtension, nodes)(
        instances, ({extName}) => (([name,, instance]) => {
            // Sometime `extName` is instance of custom tag
            return name === extName || instance === extName
        })
    );
}
