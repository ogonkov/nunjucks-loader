export function getGlobals(globals) {
    function imports() {
        return globals.map(({
            importStatement,
            dependencyInject
        }) => {
            return `
            ${importStatement}
            ${dependencyInject}`;
        }).join('')
    }

    return {
        imports
    }
}
