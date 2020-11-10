import {TEMPLATE_DEPENDENCIES} from '../constants';
import {ASSETS_KEY} from '../static-extension/contants';

import {getModuleOutput} from './get-module-output';


export function getLoaderOutput({
    templateImport,
    imports,
    defaultExport,
    precompiled,
    envOptions
}) {
    return `
        ${imports}
        ${precompiled}

        function nunjucksTemplate(ctx = {}) {
            const templateContext = {
                ${ASSETS_KEY}: ${TEMPLATE_DEPENDENCIES}.assets,
                ...ctx
            };

            var nunjucks = (${getModuleOutput('runtime')})(
                ${envOptions},
                ${TEMPLATE_DEPENDENCIES}
            );

            if (nunjucks.isAsync()) {
                return nunjucks.renderAsync(
                    ${templateImport},
                    templateContext
                );
            }
        
            return nunjucks.render(
                ${templateImport},
                templateContext
            );
        };

        nunjucksTemplate.__nunjucks_precompiled_template__ = ${TEMPLATE_DEPENDENCIES}.templates[${templateImport}];
        nunjucksTemplate.${TEMPLATE_DEPENDENCIES} = ${TEMPLATE_DEPENDENCIES};

        ${defaultExport} nunjucksTemplate;
    `;
}
