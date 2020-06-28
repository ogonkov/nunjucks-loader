import {getModule} from '../utils/get-module';

/**
 * @param {[string, string]} addonEntry
 * @return {Promise<[string, string, function]>}
 */
function loadAddon([name, importPath]) {
    return import(importPath).then(function(instance) {
        return [name, importPath, getModule(instance)];
    });
}

/**
 * @param {Object.<string, string>} addonEntries
 * @returns {Promise<Array[]>}
 */
export function getAddonsMeta(addonEntries) {
    const entries = Object.entries(addonEntries).map(loadAddon);

    return Promise.all(entries);
}
