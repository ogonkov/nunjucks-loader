export function isDynamic(part) {
    return /^['"]/.test(part);
}

export function isDynamicPath(path) {
    return path.split(' + ').some(isDynamic)
}

export function getArgs(path) {
    return path.split(' + ').filter(function(part) {
        return !isDynamic(part);
    })
}
