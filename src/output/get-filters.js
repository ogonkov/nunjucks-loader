import {stringifyRequest} from 'loader-utils';
import {getModuleOutput} from './get-module-output';

export function getFilters(filters) {
    function imports(loaderContext) {
        return filters.map(([filterName, importPath, filterInstance]) => {
            const importVar = `_filter_${filterName}`;

            return `
            var ${importVar} = require(${stringifyRequest(
                loaderContext,
                importPath
            )});
            __nunjucks_module_dependencies__.filters['${filterName}'] = {
                module: ${getModuleOutput(importVar)},
                async: ${JSON.stringify(filterInstance.async === true)}
            };`;
        }).join('');
    }

    return {
        imports
    };
}
