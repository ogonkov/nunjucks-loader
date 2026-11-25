import {statsCompiler} from './stats-compiler';


type CompiledTemplate = (context?: Record<string, unknown>) => string | Promise<string>;

export default async (fixture: string, options: Parameters<typeof statsCompiler>[1] = {}): Promise<CompiledTemplate> => {
    const {stats, bundleName} = await statsCompiler(fixture, options);

    if (stats.hasErrors()) {
        const [error] = stats.toJson().errors ?? [];
        const errorCopy = new Error(error?.message);

        Object.assign(errorCopy, error);

        throw errorCopy;
    }

    const module = await import(`./bundles/${bundleName}.js`);

    return module.default || module;
}
