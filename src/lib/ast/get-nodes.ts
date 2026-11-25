import nunjucks from 'nunjucks';

export function getNodes(source: string, extensions?: nunjucks.Extension[], options?: nunjucks.TokenizerOptions) {
    return nunjucks.parser.parse(
        source,
        extensions,
        options
    );
}
