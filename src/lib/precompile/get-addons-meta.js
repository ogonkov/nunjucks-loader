import {AddonWrapper} from '../addons-wrapper/AddonWrapper';


/**
 * @param {Array.<string[]>} addonEntries
 * @param {string} type
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addonEntries, type) {
    return addonEntries.map(([name, importPath]) => new AddonWrapper({
        name,
        importPath,
        type
    }));
}
