import nunjucks from 'nunjucks';

export function isLiteral(
    node: unknown,
): node is nunjucks.nodes.Literal<string, nunjucks.nodes.LiteralValue> {
    return node instanceof nunjucks.nodes.Literal;
}
