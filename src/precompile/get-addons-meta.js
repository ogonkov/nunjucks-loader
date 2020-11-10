import {getModule} from '../utils/get-module';

/**
 * @param {[string, string]} addonEntry
 * @return {Promise<[string, string, function]>}
 */
async function loadAddon([name, importPath]) {
    const instance = await import(importPath);

    return [name, importPath, getModule(instance)];
}

/**
 * @param {Array.<string[]>} addonEntries
 * @returns {Promise<Array[]>}
 */
export function getAddonsMeta(addonEntries) {
    const entries = addonEntries.map(loadAddon);

    return Promise.all(entries);
}
