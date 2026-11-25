import type {PrecompiledTemplate} from 'nunjucks';

import {TEMPLATE_DEPENDENCIES} from '../constants';


export function localVarWrapper(templates: PrecompiledTemplate[]) {
    let out = '';

    for (let i = 0; i < templates.length; i++) {
        const {name, template} = templates[i];

        out += `
            ${TEMPLATE_DEPENDENCIES}.templates[${JSON.stringify(name)}] = (function() {
                ${template}
            })();
        `;
    }

    return out;
}
