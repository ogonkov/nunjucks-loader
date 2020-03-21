import {stringifyRequest} from 'loader-utils';

export function getExtensions(extensions) {
    function imports(loaderContext) {
        return extensions.map(([name, importPath]) => (
            `
                var _extension_${name} = require(${stringifyRequest(
                    loaderContext,
                    importPath
                )});
                __nunjucks_module_dependencies__.extensions['${name}'] = {
                    module: _extension_${name}
                };
            `
        )).join('');
    }

    return {
        imports
    };
}
