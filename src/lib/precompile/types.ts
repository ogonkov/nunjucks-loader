import type {ConfigureOptions} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import type {FilterWrapper} from '../addons-wrapper/FilterWrapper';

export type AddonPaths = Record<string, string>;

export interface DependencyOptions {
    loaderContext: LoaderContext<unknown>;
    es: boolean;
}

export interface AddonMetaOptions extends DependencyOptions {
    type: 'extensions' | 'globals';
}

export interface FilterMetaOptions extends DependencyOptions {
    type: 'filters';
}

export interface ConfigureEnvironmentOptions {
    searchPaths?: string | string[];
    /** Autoescaping defaults to true; undefined-value errors and whitespace trimming default to false. */
    options?: ConfigureOptions;
    extensions?: AddonWrapper[];
    filters?: FilterWrapper[];
}

export interface UsedDependenciesOptions {
    searchPaths: string[];
    assetsPaths: string | string[];
    globals: AddonPaths;
    esModule: boolean;
}
