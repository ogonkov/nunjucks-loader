import {statsCompiler} from './stats-compiler';


export default (fixture, options = {}) => {
    return statsCompiler(fixture, options).then(function({stats, bundleName}) {
        if (stats.hasErrors()) {
            const [error] = stats.toJson().errors;
            const errorCopy = new Error(error.message);

            Object.entries(error).forEach(([k, v]) => {
                errorCopy[k] = v;
            });

            throw errorCopy;
        }

        return import(`./bundles/${bundleName}.js`).then(function(module) {
            return module.default || module;
        });
    });
}
