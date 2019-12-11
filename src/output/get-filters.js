export function getFilters(filters) {
    function imports() {
        return filters.map(([filterName, importPath]) => (`
            var _filter_${filterName} = require('${importPath}');
            __nunjucks_module_dependencies__.filters['${filterName}'] = {
                module: _filter_${filterName}
            };
        `));
    }

    return {
        imports
    };
}
