import {toRegExpSource} from '../utils/to-regexp-source';
import {unquote} from '../utils/unquote';

function toGlob(part) {
    if (!part.startsWith('"')) {
        return '([^+]+)';
    }

    return unquote(part);
}

export function getDynamicPathRegexp(path) {
    const regexpSource = toRegExpSource(path)
        .split(' \\+ ')
        .map(toGlob)
        .join('');

    return new RegExp(`${regexpSource}$`);
}
