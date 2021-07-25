import fs from 'fs';
import {promisify} from 'util';

import {getGlob} from './get-glob';


const fsAccess = promisify(fs.access);

/**
 * @param {ImportWrapper} path
 * @returns {Promise<boolean>}
 */
async function isExists(path) {
    if (path.isDynamic()) {
        const glob = await getGlob();
        const files = await glob(path.toGlob());

        return files.length > 0;
    }

    try {
        await fsAccess(path.toString());
        return true;
    } catch (exception) {
        return false;
    }
}

/**
 * @param {ImportWrapper[]} paths
 * @returns {Promise<ImportWrapper>}
 */
export async function getFirstExistedPath(paths) {
    for (const path of paths) {
        const exist = await isExists(path);
        if (exist) {
            return path;
        }
    }

    throw new Error('Path not found');
}
