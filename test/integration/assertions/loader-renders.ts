import assert from 'node:assert/strict';

import type {CompilerOptions} from './types.js';

import singleCJS from '#dist/cjs/single.cjs';
import childCJS from '#dist/cjs/child.cjs';
import inheritanceCJS from '#dist/cjs/inheritance.cjs';
import multipleIncludesCJS from '#dist/cjs/multipleIncludes.cjs';
import builtinFiltersCJS from '#dist/cjs/builtinFilters.cjs';
import builtinTagsCJS from '#dist/cjs/builtinTags.cjs';
import macroCJS from '#dist/cjs/macro.cjs';
import jinjaCJS from '#dist/cjs/jinja.cjs';
import nonRelativeCJS from '#dist/cjs/nonRelative.cjs';
import globalsBaseCJS from '#dist/cjs/globalsBase.cjs';
import globalsChildCJS from '#dist/cjs/globalsChild.cjs';
import globalsMultipleCJS from '#dist/cjs/globalsMultiple.cjs';
import extensionsBaseCJS from '#dist/cjs/extensionsBase.cjs';
import extensionsChildCJS from '#dist/cjs/extensionsChild.cjs';
import extensionsMultipleCJS from '#dist/cjs/extensionsMultiple.cjs';
import asyncExtensionsCJS from '#dist/cjs/asyncExtensions.cjs';
import filtersSingleCJS from '#dist/cjs/filtersSingle.cjs';
import filtersMultipleCJS from '#dist/cjs/filtersMultiple.cjs';
import filtersChildrenCJS from '#dist/cjs/filtersChildren.cjs';
import asyncFiltersCJS from '#dist/cjs/asyncFilters.cjs';
import singleESM from '#dist/esm/single.cjs';
import childESM from '#dist/esm/child.cjs';
import inheritanceESM from '#dist/esm/inheritance.cjs';
import multipleIncludesESM from '#dist/esm/multipleIncludes.cjs';
import builtinFiltersESM from '#dist/esm/builtinFilters.cjs';
import builtinTagsESM from '#dist/esm/builtinTags.cjs';
import macroESM from '#dist/esm/macro.cjs';
import jinjaESM from '#dist/esm/jinja.cjs';
import nonRelativeESM from '#dist/esm/nonRelative.cjs';
import globalsBaseESM from '#dist/esm/globalsBase.cjs';
import globalsChildESM from '#dist/esm/globalsChild.cjs';
import globalsMultipleESM from '#dist/esm/globalsMultiple.cjs';
import extensionsBaseESM from '#dist/esm/extensionsBase.cjs';
import extensionsChildESM from '#dist/esm/extensionsChild.cjs';
import extensionsMultipleESM from '#dist/esm/extensionsMultiple.cjs';
import asyncExtensionsESM from '#dist/esm/asyncExtensions.cjs';
import filtersSingleESM from '#dist/esm/filtersSingle.cjs';
import filtersMultipleESM from '#dist/esm/filtersMultiple.cjs';
import filtersChildrenESM from '#dist/esm/filtersChildren.cjs';
import asyncFiltersESM from '#dist/esm/asyncFilters.cjs';

const bundles = [
    ['cjs', {
        'fixtures/single.njk': singleCJS,
        'fixtures/child.njk': childCJS,
        'fixtures/inheritance.njk': inheritanceCJS,
        'fixtures/multiple-same-includes.njk': multipleIncludesCJS,
        'fixtures/builtin-filters.njk': builtinFiltersCJS,
        'fixtures/builtin-tags.njk': builtinTagsCJS,
        'fixtures/macro.njk': macroCJS,
        'fixtures/jinja-syntax.njk': jinjaCJS,
        'fixtures/django_project/app_example/templates/main/main.njk': nonRelativeCJS,
        'fixtures/globals/base.njk': globalsBaseCJS,
        'fixtures/globals/child.njk': globalsChildCJS,
        'fixtures/globals/multiple.njk': globalsMultipleCJS,
        'fixtures/extensions/base.njk': extensionsBaseCJS,
        'fixtures/extensions/child.njk': extensionsChildCJS,
        'fixtures/extensions/multiple.njk': extensionsMultipleCJS,
        'fixtures/extensions/multiple.njk?async': asyncExtensionsCJS,
        'fixtures/filters/single.njk': filtersSingleCJS,
        'fixtures/filters/multiple.njk': filtersMultipleCJS,
        'fixtures/filters/children.njk': filtersChildrenCJS,
        'fixtures/filters/children.njk?async': asyncFiltersCJS,
    }],
    ['esm', {
        'fixtures/single.njk': singleESM,
        'fixtures/child.njk': childESM,
        'fixtures/inheritance.njk': inheritanceESM,
        'fixtures/multiple-same-includes.njk': multipleIncludesESM,
        'fixtures/builtin-filters.njk': builtinFiltersESM,
        'fixtures/builtin-tags.njk': builtinTagsESM,
        'fixtures/macro.njk': macroESM,
        'fixtures/jinja-syntax.njk': jinjaESM,
        'fixtures/django_project/app_example/templates/main/main.njk': nonRelativeESM,
        'fixtures/globals/base.njk': globalsBaseESM,
        'fixtures/globals/child.njk': globalsChildESM,
        'fixtures/globals/multiple.njk': globalsMultipleESM,
        'fixtures/extensions/base.njk': extensionsBaseESM,
        'fixtures/extensions/child.njk': extensionsChildESM,
        'fixtures/extensions/multiple.njk': extensionsMultipleESM,
        'fixtures/extensions/multiple.njk?async': asyncExtensionsESM,
        'fixtures/filters/single.njk': filtersSingleESM,
        'fixtures/filters/multiple.njk': filtersMultipleESM,
        'fixtures/filters/children.njk': filtersChildrenESM,
        'fixtures/filters/children.njk?async': asyncFiltersESM,
    }],
] as const;

export const renders = bundles.map(([mode, templates]) => [
    mode,
    (fixture: keyof typeof templates, options: CompilerOptions) => {
        assert.equal(options.esModule, mode === 'esm');
        return templates[fixture];
    }
] as const);
