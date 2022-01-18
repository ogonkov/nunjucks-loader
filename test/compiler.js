import {statsCompiler} from './stats-compiler';


export default async (fixture, options = {}) => {
    const {stats, bundleName} = await statsCompiler(fixture, options);

    if (stats.hasErrors()) {
        const [error] = stats.toJson().errors;
        const errorCopy = new Error(error.message);

        Object.entries(error).forEach(([k, v]) => {
            errorCopy[k] = v;
        });

        throw errorCopy;
    }

    const module = await import(`./bundles/${bundleName}.js`);

    return module.default || module;
}
