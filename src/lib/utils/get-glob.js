import {promisify} from 'util';

import {getModule} from '../../public/utils/get-module';

export async function getGlob() {
    const glob = await import('glob');
    const globModule = getModule(glob);

    return promisify(globModule);
}
