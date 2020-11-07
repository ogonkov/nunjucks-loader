import fs from 'fs';
import {promisify} from 'util';

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

export async function getFirstExistedPath(paths) {
    for (const path of paths) {
        const exist = await isExists(path);
        if (exist) {
            return path;
        }
    }

    throw new Error('Path not found');
}
