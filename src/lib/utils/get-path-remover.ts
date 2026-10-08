import path from 'path';

/**
 * Returns a function that removes path from given one
 */
export function getPathRemover(targetPath: string) {
    const normalizedTargetPath = path.resolve(targetPath);

    function removePath(pathToRemove: string) {
        return normalizedTargetPath
            .replace(path.resolve(pathToRemove), '')
            .replace(/^[\\/]/, '');
    }

    return removePath;
}
