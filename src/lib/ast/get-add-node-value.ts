import nunjucks from 'nunjucks';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {isLiteral} from './is-literal';

/**
 * Parse `Add` value to expression
 * @example
 *   'foo' + bar + 'qux'
 */
export function getAddNodeValue(node: unknown) {
    if (!(node instanceof nunjucks.nodes.Add)) {
        throw new TypeError('Wrong node type');
    }

    const stack = [node.left, node.right];
    const value = new ImportWrapper();

    while (stack.length) {
        const node = stack.shift();
        if (node instanceof nunjucks.nodes.Add) {
            stack.unshift(node.left, node.right);
            continue;
        }

        if (isLiteral(node) && typeof node.value === 'string') {
            value.addLiteral(node.value);
            continue;
        }

        if (node instanceof nunjucks.nodes.Symbol && typeof node.value === 'string') {
            value.addSymbol(node.value);
            continue;
        }

        throw new TypeError('Unsupported node signature');
    }

    return value;
}
