import nunjucks from 'nunjucks/browser/nunjucks-slim';

export function StaticExtension() {
    this.tags = ['static'];
    this.parse = function parse(parser, nodes) {
        const token = parser.nextToken();
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);

        return new nodes.CallExtensionAsync(this, 'run', args);
    };
    this.run = function run(...args) {
        const callback = args.pop();
        const [, url] = args;

        import(url).then(function(path) {
            callback(null, new nunjucks.runtime.SafeString(path));
        }, function(error) {
            callback(error);
        });
    };
}
