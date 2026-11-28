import type {LoaderContext} from 'webpack';

import {IMPORTS_PREFIX} from '../constants';
import {toVar} from '../utils/to-var';

import {getDynamicImport} from './get-dynamic-import';
import {getDynamicMeta} from './get-dynamic-meta';
import type {ImportPair} from './types';


export function getAssets(assets: ImportPair[]) {
    function imports(loaderContext: LoaderContext<unknown>, esModule: boolean) {
        return assets.map(function([assetPath, assetImport]) {
            const uuid = assetPath.getHash();
            const importVar = toVar(
                `${IMPORTS_PREFIX}_asset_${uuid}`
            );
            const importInvocation = getDynamicImport(
                loaderContext,
                assetPath,
                assetImport,
                {
                    esModule,
                    importVar
                }
            );
            const importMeta = getDynamicMeta(assetPath, assetImport, {
                metaKey: 'assets',
                depsKey: assetPath.getHash(),
                importVar
            });

            return `
            ${importInvocation}
            ${importMeta}
            `;
        }).join('');
    }

    return {
        imports
    };
}
