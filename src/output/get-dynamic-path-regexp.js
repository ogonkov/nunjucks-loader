import {toRegExpSource} from '../utils/to-regexp-source';

function toGlob(part) {
    if (!part.startsWith('"')) {
        return '([^+]+)';
    }

    return part.replace(/^"|"$/g, '');
}

export function getDynamicPathRegexp(path) {
    const regexpSource = toRegExpSource(path)
        .split(' \\+ ')
        .map(toGlob)
        .join('');

    return new RegExp(`${regexpSource}$`);
}
