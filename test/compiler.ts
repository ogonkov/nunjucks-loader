import {statsCompiler} from './stats-compiler';
import type {T, O} from './types';


export default async (fixture: string, options: O = {}): Promise<T> => {
    const {stats, bundleName} = await statsCompiler(fixture, options);

    if (stats.hasErrors()) {
        const [error] = stats.toJson().errors ?? [];
        const errorCopy = new Error(error?.message) as Error & Record<string, unknown>;

        Object.entries(error ?? {}).forEach(([k, v]) => {
            errorCopy[k] = v;
        });

        throw errorCopy;
    }

    const module = await import(`./bundles/${bundleName}.js`);

    return module.default || module;
}
