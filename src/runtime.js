const {WebpackPrecompiledLoader} = require('./WebpackPrecompiledLoader');

const {Environment} = require('nunjucks/browser/nunjucks-slim');

module.exports = function runtime(options, globals, precompiled) {
    const env = new Environment(
        new WebpackPrecompiledLoader(precompiled),
        options
    );

    globals.forEach(([name, fn]) => {
        env.addGlobal(name, fn);
    });

    return {
        render(name, ctx, cb) {
            return env.render(name, ctx, cb);
        }
    };
};
