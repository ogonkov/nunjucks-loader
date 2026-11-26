import path from 'path';

import type {LoaderContext} from 'webpack';

import {ERROR_MODULE_NOT_FOUND} from './lib/constants';
import {doTransform} from './lib/do-transform';
import {getLoaderOptions} from './lib/get-loader-options';
import type {NullableLoaderOptions} from './lib/types';
import {getImportPath} from './lib/utils/get-import-path';


export default function nunjucksLoader(this: LoaderContext<NullableLoaderOptions>, source: string) {
    const callback = this.async();
    const options = getLoaderOptions(this, callback);

    if (options === null) {
        return;
    }

    const searchPaths = Array.isArray(options.searchPaths) ? options.searchPaths : [options.searchPaths];
    const normalizedSearchPaths = searchPaths.map(path.normalize);
    const resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );

    doTransform(source, this, {
        resourcePathImport,
        normalizedSearchPaths,
        options
    }).then(function(result) {
        callback(null, result);
    }, function(error: NodeJS.ErrnoException) {
        if (error.code === ERROR_MODULE_NOT_FOUND &&
            error.message.includes("'glob'")) {
            return callback(new Error(
                'Attempt to use dynamic assets ' +
                'without optional "glob" dependency installed'
            ));
        }

        callback(error);
    });
}
