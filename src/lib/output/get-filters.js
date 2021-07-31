export function getFilters(filters) {
    async function imports() {
        const imports = await Promise.all(filters.map(({
            importStatement,
            dependencyInject
        }) => dependencyInject.then((dependencyInject) => {
            return `
            ${importStatement}
            ${dependencyInject}`;
        })));

        return imports.join('');
    }

    return {
        imports
    };
}
