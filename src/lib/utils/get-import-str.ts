export function getImportStr(path: string, esModule?: boolean, isDynamic?: boolean): (name?: string, sym?: string) => string {
    const isES = esModule === true;

    function getImportInvocationString(name?: string, sym?: string): string {
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
