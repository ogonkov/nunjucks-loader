import type {FilterOutput} from './types';

export function getFilters(filters: FilterOutput[]) {
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
