import type {Extension} from 'nunjucks';

import {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {FilterWrapper} from '../addons-wrapper/FilterWrapper';

import type * as T from './types';


/**
 * @param {Object.<string, string>} addons
 * @param {Object} options
 * @param {string} options.type
 * @param {Object} options.loaderContext
 * @param {boolean} options.es
 * @returns {AddonWrapper[]}
 */
export function getAddonsMeta(addons: T.AddonPaths, options: T.FilterMetaOptions): FilterWrapper[];
export function getAddonsMeta(addons: T.AddonPaths, options: T.ExtensionMetaOptions): AddonWrapper<Extension>[];
export function getAddonsMeta(addons: T.AddonPaths, options: T.GlobalMetaOptions): AddonWrapper[];
export function getAddonsMeta(addons: T.AddonPaths, options: T.AddonMetaOptions) {
    let Klass: typeof AddonWrapper | typeof FilterWrapper = AddonWrapper;
    if (options.type === 'filters') {
        Klass = FilterWrapper;
    }

    return Object.entries(addons).map(([name, importPath]) => new Klass({
        ...options,
        name,
        importPath
    }));
}
