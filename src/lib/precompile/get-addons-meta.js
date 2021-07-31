import {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {FilterWrapper} from '../addons-wrapper/FilterWrapper';


/**
 * @param {Object.<string, string>} addons
 * @param {Object} options
 * @param {string} options.type
 * @param {Object} options.loaderContext
 * @param {boolean} options.es
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addons, options) {
    let Klass = AddonWrapper;
    if (options.type === 'filters') {
        Klass = FilterWrapper;
    }

    return Object.entries(addons).map(([name, importPath]) => new Klass({
        ...options,
        name,
        importPath
    }));
}
