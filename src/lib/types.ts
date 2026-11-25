import type {ConfigureOptions} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonPaths} from './precompile/types';
import type schema from './schema';

export interface LoaderOptions extends Pick<ConfigureOptions,
    'dev' | 'autoescape' | 'throwOnUndefined' | 'trimBlocks' | 'lstripBlocks' | 'tags'
> {
    jinjaCompat?: boolean;
    searchPaths?: string | string[];
    assetsPaths?: string | string[];
    globals?: AddonPaths;
    extensions?: AddonPaths;
    filters?: AddonPaths;
    esModule?: boolean;
}

type NullableProperties<T> = {[Key in keyof T]: T[Key] | null};

/** Accepted options before null values are removed. */
export type NullableLoaderOptions = NullableProperties<Omit<LoaderOptions, 'tags'>> & {
    tags?: NullableProperties<NonNullable<LoaderOptions['tags']>> | null;
};

type SchemaProperties = typeof schema.properties;
type DefaultedOptionKeys = {
    [Key in keyof SchemaProperties]: SchemaProperties[Key] extends {default: unknown} ? Key : never;
}[keyof SchemaProperties];

/** Loader options after applying the defaults from schema. */
export type ResolvedLoaderOptions = LoaderOptions & Required<Pick<LoaderOptions, DefaultedOptionKeys>>;

export interface TransformOptions {
    resourcePathImport: string;
    options: ResolvedLoaderOptions;
    normalizedSearchPaths: string[];
}

export type LoaderCallback = LoaderContext<LoaderOptions>['callback'];
