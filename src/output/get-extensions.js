export function getExtensions(extensions) {
    function imports() {
        return extensions.map(([name, importPath]) => (
            `
                var _extension_${name} = require(${JSON.stringify(importPath)});
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
