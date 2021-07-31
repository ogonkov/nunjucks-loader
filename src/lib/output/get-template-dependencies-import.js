import {stringifyRequest} from 'loader-utils';

import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';

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
    ${TEMPLATE_DEPENDENCIES}.assets = ${getAssignments(assignments.assets)}
    `;
}

function foldDependenciesToImports(
    loaderContext,
    esModule,
    [imports, assignment],
    [, fullPath],
    i
) {
    const path = stringifyRequest(loaderContext, fullPath.toString());
    const importVar = toVar(`${IMPORTS_PREFIX}_dep_${i}`);
    const join = joinAssignments.bind(null, assignment, importVar);

    return [
        `
        ${imports}
        ${getImportStr(path, esModule)(importVar)}
        `,
        {
            templates: join('templates'),
            globals: join('globals'),
            extensions: join('extensions'),
            filters: join('filters'),
            assets: join('assets')
        }
    ];
}

/**
 * Import nested templates dependencies
 *
 * @example
 *     var __nunjucks_module_dependencies__ = {}
 *     import dep0 from './nested-template.njk';
 *     __nunjucks_module_dependencies__.templates = {
 *         ...dep0.__nunjucks_module_dependencies__.templates
 *     };
 *
 * @param {Object} loaderContext
 * @param {boolean} esModule
 * @param {Array<string[]>} dependencies
 * @returns {string}
 */
export function getTemplateDependenciesImport(loaderContext, esModule, dependencies) {
    return getImports(
        ...dependencies.reduce(foldDependenciesToImports.bind(null, loaderContext, esModule), ['', {
            templates: '',
            globals: '',
            extensions: '',
            filters: '',
            assets: ''
        }])
    );
}
