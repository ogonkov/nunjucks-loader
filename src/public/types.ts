import type {ConfigureOptions, ContextBlock, Environment, Extension} from 'nunjucks';

export interface CompiledTemplate {
    root: ContextBlock;
    [block: string]: ContextBlock;
}

export type PrecompiledTemplates = Record<string, CompiledTemplate>;

export interface PrecompiledSource {
    src: {
        type: 'code';
        obj: CompiledTemplate;
    };
    path: string;
}

export interface RuntimeOptions extends ConfigureOptions {
    jinjaCompat?: boolean;
    isAsyncTemplate?: boolean;
}

export interface RuntimeAddon<T> {
    module: T;
}

export interface RuntimeFilter extends RuntimeAddon<Parameters<Environment['addFilter']>[1]> {
    async?: boolean;
}

export interface RuntimeDependencies {
    globals?: Record<string, RuntimeAddon<unknown>>;
    extensions?: Record<string, RuntimeAddon<Extension>>;
    filters?: Record<string, RuntimeFilter>;
    templates?: PrecompiledTemplates;
}

export type RenderContext = Parameters<Environment['render']>[1];
