import fs from 'fs';
import {promisify} from 'util';
import {getGlob} from './utils/get-glob';
import {unquote} from './utils/unquote';
import {getErrorCopy} from './utils/get-error-copy';
import {ERROR_MODULE_NOT_FOUND} from './constants';

const fsAccess = promisify(fs.access);
function isExists(path) {
    if (isExpression(path)) {
        return getGlob().then(function(glob) {
            return new Promise(function(resolve, reject) {
                glob(getGlobExpression(path), function(err, files) {
                    if (err) {
                        return reject(err);
                    }

                    resolve(files.length > 0);
                });
            });
        });
    }

    return fsAccess(path);
}

function isExpression(str) {
    return /" \+ [^ ]+( \+ "|$)/.test(str);
}

function getGlobExpression(pathExpression) {
    return unquote(pathExpression.replace(/" \+ [^ ]+( \+ "|$)/g, '*'));
}

export function getFirstExistedPath(paths) {
    return paths.reduce(function(resolved, path) {
        return resolved.then(function(existedFile) {
            if (typeof existedFile === 'string') {
                return existedFile;
            }

            return isExists(path).then(
                () => path,
                (error) => {
                    if (error.code !== ERROR_MODULE_NOT_FOUND) {
                        return false;
                    }

                    throw getErrorCopy(error);
                }
            );
        });
    }, Promise.resolve()).then(function(path) {
        if (typeof path !== 'string') {
            throw new Error('Template not found');
        }

        return path;
    })
}
