/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function numericalComparison(a, b) {
    return a - b;
}

/**
 * @param {string} attribute
 * @param {function(*, *): number} [comparison]
 * @returns {function(*, *): number}
 */
export function sortBy(attribute, comparison = numericalComparison) {
    return function compare(a, b) {
        return comparison(a?.[attribute], b?.[attribute]);
    };
}
