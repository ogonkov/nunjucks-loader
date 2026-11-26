import {statsCompiler} from './stats-compiler';
import type {CompiledTemplate, CompilerOptions} from './types';


export default async (fixture: string, options: CompilerOptions = {}): Promise<CompiledTemplate> => {
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
