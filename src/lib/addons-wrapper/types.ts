import type {Environment} from 'nunjucks';
import type {LoaderContext} from 'webpack';

import type {AddonWrapper} from './AddonWrapper';

export interface AddonWrapperOptions {
    name: string;
    importPath: string;
    type: string;
    es: boolean;
    loaderContext: LoaderContext<unknown>;
}

export type FilterWrapperOptions = Omit<AddonWrapperOptions, 'type'>;
export type FilterFunction = Parameters<Environment['addFilter']>[1] & {async?: boolean};
/** Wrapper whose instance getter has cached the imported module. */
export type LoadedAddon<T extends AddonWrapper> = T & {readonly instance: Awaited<T['instance']>};
