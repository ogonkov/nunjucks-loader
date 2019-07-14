import path from 'path';
import {getOptions, stringifyRequest} from 'loader-utils';

import {precompileTemplate} from "./precompile-template";

function render(loader, source, options) {
    return precompileTemplate(loader, source, options);
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
    render(this, source, options).then((precompiled) => {
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
