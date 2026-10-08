import fs from 'fs';
import {promisify} from 'util';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getGlob} from './get-glob';


const fsAccess = promisify(fs.access);

async function isExists(path: ImportWrapper) {
    if (path.isDynamic()) {
        const glob = await getGlob();
        const files = await glob(path.toGlob(), {windowsPathsNoEscape: process.platform === 'win32'});

        return files.length > 0;
    }

    try {
        await fsAccess(path.toString());
        return true;
    } catch {
        return false;
    }
}

export async function getFirstExistedPath(paths: ImportWrapper[]) {
    for (const path of paths) {
        const exist = await isExists(path);
        if (exist) {
            return path;
        }
    }

    throw new Error('Path not found');
}
