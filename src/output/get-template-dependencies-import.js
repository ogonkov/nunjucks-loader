import {stringifyRequest} from 'loader-utils';
import {TEMPLATE_DEPENDENCIES} from '../constants';

function getImports(imports, assignments) {
    return `
        ${imports}
        var ${TEMPLATE_DEPENDENCIES} = {};
        ${TEMPLATE_DEPENDENCIES}.templates = Object.assign(
            ${assignments.templates}
        );
        ${TEMPLATE_DEPENDENCIES}.globals = Object.assign(
            ${assignments.globals}
        );
        ${TEMPLATE_DEPENDENCIES}.extensions = Object.assign(
            ${assignments.extensions}
        );
        ${TEMPLATE_DEPENDENCIES}.filters = Object.assign(
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
        `${imports}var ${importVar} = require(${path}).${TEMPLATE_DEPENDENCIES};`,
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
