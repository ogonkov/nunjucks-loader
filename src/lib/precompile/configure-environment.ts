import nunjucks from 'nunjucks';

import {addonsLoader} from '../addons-wrapper/addons-loader';

import type {ConfigureEnvironmentOptions} from './types';


export async function configureEnvironment({
    searchPaths,
    options,
    extensions = [],
    filters = []
}: ConfigureEnvironmentOptions = {}) {
    const env = nunjucks.configure(searchPaths, options);

    const [loadedExtensions, loadedFilters] = await Promise.all([
        addonsLoader(extensions),
        addonsLoader(filters)
    ]);
    loadedExtensions.forEach(function({name, instance}) {
        env.addExtension(name, instance);
    });

    loadedFilters.forEach(function({name, instance}) {
        env.addFilter(name, instance, instance.async === true);
    });

    return env;
}
