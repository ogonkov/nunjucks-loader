/**
 * @param {string} path
 * @param {boolean} [isDynamic]
 * @returns {function(string, string): string}
 */
export function getImportStr(path, isDynamic) {
    /**
     * @param {string} [name] Variable name to be used
     * @param {string} [sym]  Module symbol to be imported
     * @returns {string}
     */
    function getImportInvocationString(name, sym) {
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
