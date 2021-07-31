import {AddonWrapper} from '../addons-wrapper/AddonWrapper';


/**
 * @param {Object.<string, string>} addons
 * @param {string} type
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addons, type) {
    return Object.entries(addons).map(([name, importPath]) => new AddonWrapper({
        name,
        importPath,
        type
    }));
}
