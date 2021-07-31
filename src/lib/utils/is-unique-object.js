export function isUniqueObject(getIndex) {
    return function compareIndexes(item, index, list) {
        return getIndex(list, item) === index;
    }
}
