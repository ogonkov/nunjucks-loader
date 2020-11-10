import path from 'path';

import {ERROR_MODULE_NOT_FOUND} from './constants';
import {doTransform} from './do-transform';
import {getLoaderOptions} from './get-loader-options';
import {getImportPath} from './utils/get-import-path';


export default function nunjucksLoader(source) {
    const callback = this.async();
    const options = getLoaderOptions(this, callback);

    if (options === null) {
        return;
    }

    const normalizedSearchPaths = [].concat(options.searchPaths).map(path.normalize);
    let resourcePathImport = getImportPath(
        this.resourcePath,
        normalizedSearchPaths
    );

    doTransform(source, this, {
        resourcePathImport,
        normalizedSearchPaths,
        options
    }).then(function(result) {
        callback(null, result);
    }, function(error) {
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
