import nunjucks from 'nunjucks';

/**
 * Parse `Add` value to expression
 * @example
 *   'foo' + bar + 'qux'
 *
 * @param {nunjucks.nodes.Add} node
 *
 * @returns {string}
 */
export function getAddNodeValue(node) {
    if (!(node instanceof nunjucks.nodes.Add)) {
        throw new TypeError('Wrong node type');
    }

    return [node.left, node.right].map(function(node) {
        if (node instanceof nunjucks.nodes.Add) {
            return getAddNodeValue(node);
        }

        if (node instanceof nunjucks.nodes.Literal) {
            return `"${node.value}"`;
        }

        if (node instanceof nunjucks.nodes.Symbol) {
            return node.value;
        }

        throw new TypeError('Unsupported node signature');
    }).join(' + ');
}
