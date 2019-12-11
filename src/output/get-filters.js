export function getFilters(filters) {
    function imports() {
        return filters.map(([filterName, importPath, filterInstance]) => (`
            var _filter_${filterName} = require('${importPath}');
            __nunjucks_module_dependencies__.filters['${filterName}'] = {
                module: _filter_${filterName},
                async: ${JSON.stringify(filterInstance.async === true)}
            };
        `));
    }

    return {
        imports
    };
}
