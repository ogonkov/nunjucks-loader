import {stringifyRequest} from 'loader-utils';

import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';

import {getModuleOutput} from './get-module-output';

export function getFilters(filters) {
    function imports(loaderContext, esModule) {
        return filters.map(([filterName, importPath, filterInstance]) => {
            const importVar = toVar(`${IMPORTS_PREFIX}_filter_${filterName}`);
            const importStatement = getImportStr(
                stringifyRequest(loaderContext, importPath),
                esModule
            )(importVar);

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
