import type {ConfigureOptions, Extension, TokenizerOptions} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import type {FilterWrapper} from '../addons-wrapper/FilterWrapper';

export type AddonPaths = Record<string, string>;

export interface DependencyOptions {
    loaderContext: LoaderContext<unknown>;
    es: boolean;
}

export interface ExtensionMetaOptions extends DependencyOptions {
    type: 'extensions';
}

export interface GlobalMetaOptions extends DependencyOptions {
    type: 'globals';
}

export interface FilterMetaOptions extends DependencyOptions {
    type: 'filters';
}

export type AddonMetaOptions = ExtensionMetaOptions | GlobalMetaOptions | FilterMetaOptions;

export interface ConfigureEnvironmentOptions {
    searchPaths?: string | string[];
    /** Autoescaping defaults to true; undefined-value errors and whitespace trimming default to false. */
    options?: ConfigureOptions;
    extensions?: AddonWrapper<Extension>[];
    filters?: FilterWrapper[];
}

export interface UsedDependenciesOptions {
    searchPaths: string[];
    assetsPaths: string | string[];
    globals: AddonPaths;
    esModule: boolean;
}

export type ASTExtensions = AddonWrapper<Extension>[];
export type ASTOptions = TokenizerOptions;
