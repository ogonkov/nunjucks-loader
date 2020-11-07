import fs from 'fs';
import {promisify} from 'util';

import {ERROR_MODULE_NOT_FOUND} from '../constants';

import {getErrorCopy} from './get-error-copy';
import {getGlob} from './get-glob';
import {unquote} from './unquote';

const fsAccess = promisify(fs.access);

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isExists(path) {
    if (isExpression(path)) {
        const glob = await getGlob();
        const files = await glob(getGlobExpression(path));

        return files.length > 0;
    }

    try {
        await fsAccess(path);
        return true;
    } catch (exception) {
        return false;
    }
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
