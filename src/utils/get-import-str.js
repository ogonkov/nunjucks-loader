/**
 * @param {string} path
 * @param {boolean} [esModule]
 * @param {boolean} [isDynamic]
 * @returns {function(string, string): string}
 */
export function getImportStr(path, esModule, isDynamic) {
    const isES = esModule === true;

    /**
     * @param {string} [name] Variable name to be used
     * @param {string} [sym]  Module symbol to be imported
     * @returns {string}
     */
    function getImportInvocationString(name, sym) {
        if (isDynamic && isES) {
            return `import(${path});`;
        }

        if (name && sym && isES) {
            return `import {${sym} as ${name}} from ${path};`;
        }

        if (name && isES) {
            return `import ${name} from ${path};`;
        }

        if (name && sym) {
            return `const ${name} = require(${path}).${sym};`
        }

        if (name) {
            return `const ${name} = require(${path});`;
        }

        if (isDynamic) {
            return `require(${path});`;
        }

        throw new Error('Import var name required');
    }

    return getImportInvocationString;
}
