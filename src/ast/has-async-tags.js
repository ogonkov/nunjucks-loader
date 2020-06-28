import nunjucks from 'nunjucks';

/**
 * @param {nunjucks.nodes.Root} nodes
 * @returns {boolean}
 */
export function hasAsyncTags(nodes) {
    return [
        nunjucks.nodes.IfAsync,
        nunjucks.nodes.AsyncEach,
        nunjucks.nodes.AsyncAll,
        nunjucks.nodes.FilterAsync,
        nunjucks.nodes.CallExtensionAsync
    ].some(function examineNodes(nodeType) {
        return nodes.findAll(nodeType).length > 0;
    });
}
