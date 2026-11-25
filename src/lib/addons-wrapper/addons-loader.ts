import type {AddonWrapper} from './AddonWrapper';
import type {LoadedAddon} from './types';

/**
 * Resolve addon instances and return their wrappers in the original order.
 *
 * Each wrapper stays in the returned list; its instance is awaited rather than
 * substituted for the wrapper. A rejected instance promise rejects the result.
 *
 * @template Addon
 * @param {Addon[]} list
 *     Addon wrappers whose instance properties may contain pending promises.
 * @returns {Promise<Addon[]>}
 *     The same wrappers, in input order, after all instance values resolve.
 */
export function addonsLoader<T extends AddonWrapper>(list: T[]) {
    return Promise.all(list.map(
        (item) => Promise.resolve(item.instance).then(() => item as LoadedAddon<T>)
    ));
}
