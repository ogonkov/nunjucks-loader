const {WebpackPrecompiledLoader} = require('./WebpackPrecompiledLoader');

const {Environment} = require('nunjucks/browser/nunjucks-slim');

module.exports = function runtime(options, precompiled) {
    const env = new Environment(
        new WebpackPrecompiledLoader(precompiled),
        options
    );

    return {
        render(name, ctx, cb) {
            return env.render(name, ctx, cb);
        }
    };
};
