import type {LoaderContext} from 'webpack';

import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getImportStr} from '../utils/get-import-str';
import {stringifyRequest} from '../utils/stringify-request';
import {toVar} from '../utils/to-var';

import type {Assignments, ImportPair, ImportsAndAssignments} from './types';


function getAssignments(assignments: string) {
    if (assignments === '') {
        return '{};';
    }

    return `{${assignments}};`;
}

function joinAssignments(assignment: Assignments, importVar: string, key: keyof Assignments) {
    return [
        assignment[key],
        `...${importVar}.${TEMPLATE_DEPENDENCIES}.${key}`
    ].filter(Boolean).join(',\n');
}

function getImports(imports: string, assignments: Assignments) {
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
    loaderContext: LoaderContext<unknown>,
    esModule: boolean,
    [imports, assignment]: ImportsAndAssignments,
    [, fullPath]: ImportPair,
    i: number
): ImportsAndAssignments {
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
 */
export function getTemplateDependenciesImport(loaderContext: LoaderContext<unknown>, esModule: boolean, dependencies: ImportPair[]) {
    return getImports(
        ...dependencies.reduce<ImportsAndAssignments>(foldDependenciesToImports.bind(null, loaderContext, esModule), ['', {
            templates: '',
            globals: '',
            extensions: '',
            filters: '',
            assets: ''
        }])
    );
}
