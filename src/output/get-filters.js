import {stringifyRequest} from 'loader-utils';

export function getFilters(filters) {
    function imports(loaderContext) {
        return filters.map(([filterName, importPath, filterInstance]) => (`
            var _filter_${filterName} = require(${stringifyRequest(
                loaderContext,
                importPath
            )});
            __nunjucks_module_dependencies__.filters['${filterName}'] = {
                module: _filter_${filterName},
                async: ${JSON.stringify(filterInstance.async === true)}
            };
        `)).join('');
    }

    return {
        imports
    };
}
