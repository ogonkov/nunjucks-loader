import {TEMPLATE_DEPENDENCIES} from '../constants';

import {getModuleOutput} from './get-module-output';

export function getFilters(filters) {
    function imports() {
        return filters.map(({
            name: filterName,
            instance: filterInstance,
            importVar,
            importStatement
        }) => {
            return `
            ${importStatement}
            ${TEMPLATE_DEPENDENCIES}.filters['${filterName}'] = {
                module: ${getModuleOutput(importVar)},
                async: ${JSON.stringify(filterInstance.async === true)}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
