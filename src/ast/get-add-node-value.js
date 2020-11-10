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

    const stack = [node.left, node.right];
    const value = [];

    while (stack.length) {
        const node = stack.shift();
        if (node instanceof nunjucks.nodes.Add) {
            stack.unshift(node.left, node.right);
            continue;
        }

        if (node instanceof nunjucks.nodes.Literal) {
            value.push(`"${node.value}"`);
            continue;
        }

        if (node instanceof nunjucks.nodes.Symbol) {
            value.push(node.value);
            continue;
        }

        throw new TypeError('Unsupported node signature');
    }

    return value.join(' + ');
}
