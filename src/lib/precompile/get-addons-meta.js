import {AddonWrapper} from '../addons-wrapper/AddonWrapper';


/**
 * @param {Array.<string[]>} addonEntries
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addonEntries) {
    return addonEntries.map(([name, importPath]) => new AddonWrapper({
        name,
        importPath
    }));
}
