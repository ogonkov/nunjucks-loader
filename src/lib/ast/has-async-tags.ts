import nunjucks from 'nunjucks';

export function hasAsyncTags(nodes: nunjucks.nodes.Root) {
    return [
        nunjucks.nodes.IfAsync,
        nunjucks.nodes.AsyncEach,
        nunjucks.nodes.AsyncAll,
        nunjucks.nodes.FilterAsync,
        nunjucks.nodes.CallExtensionAsync
    ].some(function examineNodes(nodeType) {
        return nodes.findAll<nunjucks.NodeType>(nodeType).length > 0;
    });
}
