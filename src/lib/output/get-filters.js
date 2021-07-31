export function getFilters(filters) {
    async function imports() {
        const imports = await Promise.all(filters.map(async ({
            importStatement,
            dependencyInject
        }) => `
            ${importStatement}
            ${await dependencyInject}`
        ));

        return imports.join('');
    }

    return {
        imports
    };
}
