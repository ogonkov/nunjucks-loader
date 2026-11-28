import path from 'path';

import {describe, expect, it} from '@jest/globals';
import type {LoaderContext} from 'webpack';

import {AddonWrapper} from './AddonWrapper';
import {addonsLoader} from './addons-loader';

describe('instance', function() {
    it('should return the cached module after loading', async function() {
        const addon = new AddonWrapper<typeof path>({
            name: 'path',
            importPath: 'path',
            type: 'globals',
            es: false,
            // Loading an instance does not access the webpack context.
            loaderContext: {} as LoaderContext<unknown>
        });
        const pending = addon.instance;
        expect(pending).toBeInstanceOf(Promise);

        const [loaded] = await addonsLoader([addon]);

        expect(await pending).toBe(path);
        expect(loaded).toBe(addon);
        expect(loaded.instance).toBe(path);
        expect(loaded.instance.join('a', 'b')).toBe(path.join('a', 'b'));
    });
});
