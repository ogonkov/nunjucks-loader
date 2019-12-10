const {WebpackPrecompiledLoader} = require('./WebpackPrecompiledLoader');

const nunjucks = require('nunjucks/browser/nunjucks-slim');

module.exports = function runtime(options, {
    globals,
    extensions,
    templates: precompiled
}) {
    if (options.jinjaCompat === true) {
        nunjucks.installJinjaCompat();
    }

    const env = new nunjucks.Environment(
        new WebpackPrecompiledLoader(precompiled),
        options
    );

    for (const globalName in globals) {
        if (!Object.prototype.hasOwnProperty.call(globals, globalName)) {
            continue;
        }

        env.addGlobal(globalName, globals[globalName].module);
    }

    for (const extensionName in extensions) {
        if (!Object.prototype.hasOwnProperty.call(extensions, extensionName)) {
            continue;
        }

        env.addExtension(extensionName, extensions[extensionName].module);
    }

    return {
        render(name, ctx, cb) {
            return env.render(name, ctx, cb);
        }
    };
};
