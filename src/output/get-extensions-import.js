export function getExtensionsImport(extensions) {
    return extensions.map(function([name, importPath]) {
        return `
               var _extension_${name} = require('${importPath}');
           `;
    }).join('');
}
