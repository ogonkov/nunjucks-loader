const nunjucks = require('nunjucks/browser/nunjucks-slim');

function RemoteExtension() {
    this.tags = ['remote'];

    this.parse = function(parser, nodes, lexer) {
        // get the tag token
        var tok = parser.nextToken();

        // parse the args and move after the block end. passing true
        // as the second arg is required if there are no parentheses
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);

        // parse the body and possibly the error block, which is optional
        var body = parser.parseUntilBlocks('error', 'endremote');
        var errorBody = null;

        if(parser.skipSymbol('error')) {
            parser.skip(lexer.TOKEN_BLOCK_END);
            errorBody = parser.parseUntilBlocks('endremote');
        }

        parser.advanceAfterBlockEnd();

        // See above for notes about CallExtension
        return new nodes.CallExtensionAsync(this, 'run', args, [body, errorBody]);
    };

    this.run = function(context, url, body, errorBody, callback) {
        var id = 'el' + 100500;
        var ret = new nunjucks.runtime.SafeString('<div id="' + id + '">(async): ' + body() + '</div>');

        setTimeout(function() {
            callback(null, ret);
        }, 1000);
    };
}

module.exports = new RemoteExtension();
