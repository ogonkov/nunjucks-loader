declare module 'nunjucks/browser/nunjucks-slim' {
    import type * as Nunjucks from 'nunjucks';

    export * from 'nunjucks';

    // Precompiled loaders return code objects and null for missing templates.
    export interface PrecompiledLoader extends Omit<Nunjucks.ILoader, 'getSource'> {
        getSource(name: string): import('../../public/types').PrecompiledSource | null;
    }

    export type EnvironmentLoader = Nunjucks.ILoaderAny | PrecompiledLoader;

    export class Environment extends Nunjucks.Environment {
        constructor(loaders?: EnvironmentLoader | EnvironmentLoader[] | null, options?: Nunjucks.ConfigureOptions);
    }
}
