/**
 * Extract values of given object
 *
 * @template TValue
 * @param {Object.<string, string<TValue>>} item
 * @param {string[]} keys
 * @return {TValue[]}
 */
module.exports = function values(item = {}, ...keys) {
    return Object.entries(item).filter(function([key]) {
        return keys.includes(key);
    }).map(function([, value]) {
        return value;
    });
};
