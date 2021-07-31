export function unquote(str) {
    return str.replace(/(^"|"$)/g, '');
}
