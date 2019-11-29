export function getExtensions(extensions) {
    function imports() {
        return extensions.map(([name, importPath]) => (
            `var _extension_${name} = require('${importPath}');`
        )).join('');
    }

    function exports() {
        return `
            [${extensions.map(([extName]) => {
                return `['${extName}', _extension_${extName}]`;
            })}]
        `;
    }

    function moduleExports() {
        return `
            ${extensions.map(([extName]) => (`
                '${extName}': {
                    module: _extension_${extName}
                }
            `))}
        `;
    }

    return {
        imports,
        exports,
        moduleExports
    };
}
