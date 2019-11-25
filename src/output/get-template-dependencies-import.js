function getImports(imports, assignments) {
    return `
        ${imports}
        var precompiledTemplates = Object.assign(
            {},
            ${assignments}
        );
    `;
}

function foldDependenciesToImports([imports, assignment], [, fullPath], i) {
    const path = JSON.stringify(fullPath);
    const importVar = `templateDependencies${i}`;

    return [
        `${imports}var ${importVar} = require(${path}).dependencies;`,
        `${assignment}${importVar},`
    ];
}

export function getTemplateDependenciesImport(dependencies) {
    return getImports(
        ...dependencies.reduce(foldDependenciesToImports, ['', ''])
    );
}
