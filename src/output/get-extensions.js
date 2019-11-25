export function getExtensions(extensions) {
    function imports() {
        return extensions.map(([name, importPath]) => (
            `var _extension_${name} = require('${importPath}');`
        )).join('');
    }

    return {
        imports
    };
}
