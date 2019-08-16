import path from 'path';

export function getImportPath(resourcePath, searchPaths) {
    const [importPath] = searchPaths.map((x) => resourcePath
            .replace(path.resolve(x), '')
            .replace(/^\//, '')
        ).sort(function(a, b) {
            return a.length - b.length;
        });

    return importPath;
}
