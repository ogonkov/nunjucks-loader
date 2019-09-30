const {WebpackPrecompiledLoader} = require('./WebpackPrecompiledLoader');

const nunjucks = require('nunjucks/browser/nunjucks-slim');

module.exports = function runtime(options, globals, extensions, precompiled) {
    if (options.jinjaCompat === true) {
        nunjucks.installJinjaCompat();
    }

    const env = new nunjucks.Environment(
        new WebpackPrecompiledLoader(precompiled),
        options
    );

    globals.forEach(([name, fn]) => {
        env.addGlobal(name, fn);
    });

    extensions.forEach(([name, fn]) => {
        env.addExtension(name, fn);
    });

    return {
        render(name, ctx, cb) {
            return env.render(name, ctx, cb);
        }
    };
};
