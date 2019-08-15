import fs from 'fs';
import {promisify} from 'util';

const isExists = promisify(fs.access);

export function getFirstExistedPath(paths) {
    return paths.reduce(function(resolved, path) {
        return resolved.then(function(existedFile) {
            if (typeof existedFile === 'string') {
                return existedFile;
            }

            return isExists(path).then(
                () => path,
                () => false
            );
        });
    }, Promise.resolve()).then(function(path) {
        if (typeof path !== 'string') {
            throw new Error(`Template not found`);
        }

        return path;
    })
}
