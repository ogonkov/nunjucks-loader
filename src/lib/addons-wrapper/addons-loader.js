/**
 * Resolve addon instances and return their wrappers in the original order.
 *
 * @template Addon
 * @param {Addon[]} list Addon wrappers whose instances may load asynchronously.
 * @returns {Promise<Addon[]>} Wrappers with their instances resolved.
 */
export function addonsLoader(list) {
    return Promise.all(list.map(
        (item) => Promise.resolve(item.instance).then(() => item)
    ));
}
