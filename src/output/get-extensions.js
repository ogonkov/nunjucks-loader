import {stringifyRequest} from 'loader-utils';

export function getExtensions(extensions) {
    function imports(loaderContext) {
        return extensions.map(([name, importPath]) => {
            const importVar = `_extension_${name}`;

            return `
            var ${importVar} = require(${stringifyRequest(
                loaderContext,
                importPath
            )});
            __nunjucks_module_dependencies__.extensions['${name}'] = {
                module: ${importVar}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
