import path from 'path';


/**
 * Returns a function that removes path from given one
 *
 * @param {string} targetPath
 * @returns {function(string): string}
 */
export function getPathRemover(targetPath) {
    /**
     * @param {string} pathToRemove
     * @returns {string}
     */
    function removePath(pathToRemove) {
        return targetPath
            .replace(path.resolve(pathToRemove), '')
            .replace(/^\//, '');
    }

    return removePath;
}
