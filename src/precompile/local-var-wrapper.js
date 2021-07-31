import {TEMPLATE_DEPENDENCIES} from '../lib/constants';

/**
 * @typedef {Object} NunjucksPrecompiled
 * @property {string} name
 * @property {string} template
 */

/**
 * @param {NunjucksPrecompiled[]} templates
 * @returns {string}
 */
export function localVarWrapper(templates) {
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
