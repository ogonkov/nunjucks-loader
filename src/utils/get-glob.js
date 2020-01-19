import {getModule} from './get-module';

export function getGlob() {
    return import('glob').then(getModule);
}
