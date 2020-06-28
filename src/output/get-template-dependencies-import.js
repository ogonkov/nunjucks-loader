import {stringifyRequest} from 'loader-utils';
import {TEMPLATE_DEPENDENCIES} from '../constants';

function getAssignments(assignments) {
    if (assignments === '') {
        return '{};';
    }

    return `{${assignments}};`;
}

function joinAssignments(assignment, importVar, key) {
    return [
        assignment[key],
        `...${importVar}.${TEMPLATE_DEPENDENCIES}.${key}`
    ].filter(Boolean).join(',\n');
}

function getImports(imports, assignments) {
    return `
        const ${TEMPLATE_DEPENDENCIES} = {};
        ${imports}
        ${TEMPLATE_DEPENDENCIES}.templates = ${getAssignments(assignments.templates)}
        ${TEMPLATE_DEPENDENCIES}.globals = ${getAssignments(assignments.globals)}
        ${TEMPLATE_DEPENDENCIES}.extensions = ${getAssignments(assignments.extensions)}
        ${TEMPLATE_DEPENDENCIES}.filters = ${getAssignments(assignments.filters)}
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
    const join = joinAssignments.bind(null, assignment, importVar);

    return [
        `
        ${imports}
        var ${importVar} = require(${path});
        `,
        {
            templates: join('templates'),
            globals: join('globals'),
            extensions: join('extensions'),
            filters: join('filters')
        }
    ];
}

export function getTemplateDependenciesImport(loaderContext, dependencies) {
    return getImports(
        ...dependencies.reduce(foldDependenciesToImports.bind(null, loaderContext), ['', {
            templates: '',
            globals: '',
            extensions: '',
            filters: ''
        }])
    );
}
