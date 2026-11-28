import nunjucks from 'nunjucks/browser/nunjucks-slim';

import {WebpackPrecompiledLoader} from './WebpackPrecompiledLoader';
import type {RenderContext, RuntimeDependencies, RuntimeOptions} from './types';


export default function runtime(options: RuntimeOptions, {
    globals,
    extensions,
    filters,
    templates: precompiled
}: RuntimeDependencies) {
    if (options.jinjaCompat === true) {
        nunjucks.installJinjaCompat();
    }

    const env = new nunjucks.Environment(
        new WebpackPrecompiledLoader(precompiled),
        options
    );

    for (const globalName in globals) {
        if (!Object.prototype.hasOwnProperty.call(globals, globalName)) {
            continue;
        }

        env.addGlobal(globalName, globals[globalName].module);
    }

    for (const extensionName in extensions) {
        if (!Object.prototype.hasOwnProperty.call(extensions, extensionName)) {
            continue;
        }

        env.addExtension(extensionName, extensions[extensionName].module);
    }

    for (const filterName in filters) {
        if (!Object.prototype.hasOwnProperty.call(filters, filterName)) {
            continue;
        }

        env.addFilter(
            filterName,
            filters[filterName].module,
            filters[filterName].async === true
        );
    }

    return {
        render(name: string, ctx?: RenderContext) {
            return env.render(name, ctx);
        },

        renderAsync(name: string, ctx?: RenderContext) {
            return new Promise<string | null>(function renderCallback(resolve, reject) {
                env.render(name, ctx, function(error, response) {
                    if (error) {
                        return reject(error);
                    }

                    resolve(response);
                });
            });
        },

        isAsync() {
            return (
                options.isAsyncTemplate === true ||
                Object.values(filters ?? {}).some(({async}) => async === true)
            );
        }
    };
}
