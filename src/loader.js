import path from 'path';
import nunjucks from 'nunjucks';
import {getOptions, stringifyRequest} from 'loader-utils';

import {precompileWrapper} from "./precompile-wrapper";

function render(path, source, options) {
    return new Promise(function(resolve, reject) {
        try {
            const env = nunjucks.configure(options);
            const precompiled = nunjucks.precompileString(source, {
                env,
                name: path,
                wrapper: precompileWrapper
            });

            resolve(precompiled);
        } catch (e) {
            reject(e);
        }
    });
}

export default function nunjucksLoader(source) {
    const {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags
    } = getOptions(this) || {};

    const callback = this.async();
    const options = {
        autoescape,
        throwOnUndefined,
        trimBlocks,
        lstripBlocks,
        tags
    };
    render(this.resourcePath, source, options).then((precompiled) => {
        const runtimeImport = `var runtime = require(${stringifyRequest(
            this,
            `${path.resolve(path.join(__dirname, 'runtime.js'))}`
        )});`;

        callback(null, `
            ${runtimeImport}
            
            module.exports = function nunjucksTemplate(ctx) {
              ${precompiled}
            
              var nunjucks = runtime(
                ${JSON.stringify(options)},
                precompiledTemplates
              );
            
              return nunjucks.render(${JSON.stringify(this.resourcePath)}, ctx);
            };`
        );
    }, function(error) {
        callback(error);
    });
}
