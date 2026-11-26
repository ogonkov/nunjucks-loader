/**
 * Compare numeric property values in ascending order.
 *
 * @param {number} a
 *     First value to compare.
 * @param {number} b
 *     Second value to compare.
 * @returns {number}
 *     Their difference: negative when a is smaller, positive when larger.
 */
function numericalComparison(a, b) {
    return a - b;
}

/**
 * Create a comparator that orders objects by the selected property.
 *
 * Property values are passed to comparison in the same order as the objects.
 * A null or undefined object supplies undefined as its property value.
 * Without a custom comparison, property values are compared by subtraction.
 *
 * @param {string} attribute
 *     Name of the property whose values determine the ordering.
 * @param {function(*, *): number} [comparison]
 *     Compare the two property values; defaults to ascending numeric order.
 * @returns {function(*, *): number}
 *     Comparator suitable for Array.prototype.sort.
 */
export function sortBy(attribute, comparison = numericalComparison) {
    return function compare(a, b) {
        return comparison(a?.[attribute], b?.[attribute]);
    };
}
