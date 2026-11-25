import {getAddonsMeta} from './get-addons-meta';
import type {AddonPaths, DependencyOptions} from './types';


/**
 * Load filters and extensions modules
 */
export function loadDependencies(extensions: AddonPaths, filters: AddonPaths, options: DependencyOptions) {
    const _extensions = getAddonsMeta(extensions, {
        ...options,
        type: 'extensions',
    });
    const _filters = getAddonsMeta(filters, {
        ...options,
        type: 'filters'
    });

    return {
        extensions: _extensions,
        filters: _filters
    };
}
