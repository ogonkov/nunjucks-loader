import {stringifyRequest} from 'loader-utils';

function getImports(imports, assignments) {
    return `
        ${imports}
        var __nunjucks_module_dependencies__ = {};
        __nunjucks_module_dependencies__.templates = Object.assign(
            ${assignments.templates}
        );
        __nunjucks_module_dependencies__.globals = Object.assign(
            ${assignments.globals}
        );
        __nunjucks_module_dependencies__.extensions = Object.assign(
            ${assignments.extensions}
        );
        __nunjucks_module_dependencies__.filters = Object.assign(
            ${assignments.filters}
        );
    `;
}

function foldDependenciesToImports(
    loaderContext,
    [imports, assignment],
    [, fullPath],
    i
) {
    const path = stringifyRequest(loaderContext, fullPath);
    const importVar = `templateDependencies${i}`;

    return [
        `${imports}var ${importVar} = require(${path}).__nunjucks_module_dependencies__;`,
        {
            templates: [`${assignment.templates}`, `${importVar}.templates`].join(),
            globals: [`${assignment.globals}`, `${importVar}.globals`].join(),
            extensions: [`${assignment.extensions}`, `${importVar}.extensions`].join(),
            filters: [`${assignment.filters}`, `${importVar}.filters`].join()
        }
    ];
}

export function getTemplateDependenciesImport(loaderContext, dependencies) {
    return getImports(
        ...dependencies.reduce(foldDependenciesToImports.bind(null, loaderContext), ['', {
            templates: '{}',
            globals: '{}',
            extensions: '{}',
            filters: '{}'
        }])
    );
}
