import type {AddonOutput} from './types';

export function getExtensions(extensions: AddonOutput[]) {
    function imports() {
        return extensions.map(({importStatement, dependencyInject}) => {
            return `
            ${importStatement}
            ${dependencyInject}`;
        }).join('');
    }

    return {
        imports
    };
}
