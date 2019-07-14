export function precompileWrapper(templates) {
    let out = '';

    out += `var precompiledTemplates = {};`;
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
