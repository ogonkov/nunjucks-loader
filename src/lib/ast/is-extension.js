/**
 * @param {nunjucks.nodes.Node} node
 * @param {Function}            ExtensionClass
 * @return {boolean}
 */
export function isExtension(node, ExtensionClass) {
    return (
        node.extName instanceof ExtensionClass ||
        node.extName === ExtensionClass.name
    );
}
