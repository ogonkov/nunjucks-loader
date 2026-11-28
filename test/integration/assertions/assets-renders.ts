import assert from 'node:assert/strict';

import type {CompilerOptions} from './types.js';

import assetStaticCJS from '#dist/cjs/assetStatic.cjs';
import assetStaticAsCJS from '#dist/cjs/assetStaticAs.cjs';
import assetDynamicCJS from '#dist/cjs/assetDynamic.cjs';
import assetDynamicTrailingSlashCJS from '#dist/cjs/assetDynamicTrailingSlash.cjs';
import assetDynamicAsCJS from '#dist/cjs/assetDynamicAs.cjs';
import assetVariablesCJS from '#dist/cjs/assetVariables.cjs';
import assetStaticESM from '#dist/esm/assetStatic.cjs';
import assetStaticAsESM from '#dist/esm/assetStaticAs.cjs';
import assetDynamicESM from '#dist/esm/assetDynamic.cjs';
import assetDynamicTrailingSlashESM from '#dist/esm/assetDynamicTrailingSlash.cjs';
import assetDynamicAsESM from '#dist/esm/assetDynamicAs.cjs';
import assetVariablesESM from '#dist/esm/assetVariables.cjs';

const bundles = [
    ['cjs', {
        'fixtures/assets/template.njk': assetStaticCJS,
        'fixtures/assets/template-as.njk': assetStaticAsCJS,
        'fixtures/assets/dynamic.njk': assetDynamicCJS,
        'fixtures/assets/dynamic-trailing-slash.njk': assetDynamicTrailingSlashCJS,
        'fixtures/assets/dynamic-as.njk': assetDynamicAsCJS,
        'fixtures/assets/dynamic-variable.njk': assetVariablesCJS,
    }],
    ['esm', {
        'fixtures/assets/template.njk': assetStaticESM,
        'fixtures/assets/template-as.njk': assetStaticAsESM,
        'fixtures/assets/dynamic.njk': assetDynamicESM,
        'fixtures/assets/dynamic-trailing-slash.njk': assetDynamicTrailingSlashESM,
        'fixtures/assets/dynamic-as.njk': assetDynamicAsESM,
        'fixtures/assets/dynamic-variable.njk': assetVariablesESM,
    }],
] as const;

export const renders = bundles.map(([mode, templates]) => [
    mode,
    (fixture: keyof typeof templates, options: CompilerOptions) => {
        assert.equal(options.esModule, mode === 'esm');
        return templates[fixture];
    }
] as const);
