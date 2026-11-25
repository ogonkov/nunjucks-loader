import {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {FilterWrapper} from '../addons-wrapper/FilterWrapper';

import type {AddonMetaOptions, AddonPaths, FilterMetaOptions} from './types';


export function getAddonsMeta(addons: AddonPaths, options: FilterMetaOptions): FilterWrapper[];
export function getAddonsMeta(addons: AddonPaths, options: AddonMetaOptions): AddonWrapper[];
export function getAddonsMeta(addons: AddonPaths, options: AddonMetaOptions | FilterMetaOptions) {
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
