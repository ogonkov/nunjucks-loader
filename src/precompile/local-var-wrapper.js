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
        const {name, template} = templates[0];

        out += `
            precompiledTemplates[${JSON.stringify(name)}] = (function() {
                ${template}
            })();
        `;
    }

    return out;
}
