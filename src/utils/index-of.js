/**
 * @param {array}    list
 * @param {function} callback
 * @returns {number}
 */
export function indexOf(list, callback) {
    const item = list.find(callback);
    return list.indexOf(item);
}
