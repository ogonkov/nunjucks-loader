import {WebpackPrecompiledLoader} from "./WebpackPrecompiledLoader";

const {Environment} = require('nunjucks/browser/nunjucks-slim');

module.exports = function(options, precompiled) {
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
