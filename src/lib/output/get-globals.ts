import type {AddonOutput} from './types';

export function getGlobals(globals: AddonOutput[]) {
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
