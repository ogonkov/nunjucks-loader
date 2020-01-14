export function getGlob() {
    return import('glob').then(glob => glob.default || glob);
}
