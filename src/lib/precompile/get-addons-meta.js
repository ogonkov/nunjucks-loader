import {AddonWrapper} from '../addons-wrapper/AddonWrapper';


/**
 * @param {Object.<string, string>} addons
 * @param {Object} options
 * @param {string} options.type
 * @param {Object} options.loaderContext
 * @param {boolean} options.es
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addons, options) {
    return Object.entries(addons).map(([name, importPath]) => new AddonWrapper({
        ...options,
        name,
        importPath
    }));
}
