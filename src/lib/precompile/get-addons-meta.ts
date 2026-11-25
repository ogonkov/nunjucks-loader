import type {Extension} from 'nunjucks';

import {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import {FilterWrapper} from '../addons-wrapper/FilterWrapper';

import type {AddonMetaOptions, AddonPaths, ExtensionMetaOptions, FilterMetaOptions, GlobalMetaOptions} from './types';


export function getAddonsMeta(addons: AddonPaths, options: FilterMetaOptions): FilterWrapper[];
export function getAddonsMeta(addons: AddonPaths, options: ExtensionMetaOptions): AddonWrapper<Extension>[];
export function getAddonsMeta(addons: AddonPaths, options: GlobalMetaOptions): AddonWrapper[];
export function getAddonsMeta(addons: AddonPaths, options: AddonMetaOptions) {
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
