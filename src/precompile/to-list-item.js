export function toListItem(list, callback) {
    return function(item) {
        return list.find(callback(item));
    };
}
