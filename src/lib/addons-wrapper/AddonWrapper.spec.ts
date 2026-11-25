import path from 'path';

import {describe, expect, it} from '@jest/globals';
import type {LoaderContext} from 'webpack';


import {AddonWrapper} from './AddonWrapper';
import {addonsLoader} from './addons-loader';

describe('constructor', function() {
    it('should throw with wrong name', function() {
        // @ts-expect-error Intentionally incomplete options exercise runtime validation.
        expect(() => new AddonWrapper({})).toThrowErrorMatchingSnapshot();
    });

    it('should throw w/out import path', function() {
        // @ts-expect-error Intentionally incomplete options exercise runtime validation.
        expect(() => new AddonWrapper({
            name: 'foo'
        })).toThrowErrorMatchingSnapshot();
    });

    it('should throw w/out type', function() {
        // @ts-expect-error Intentionally incomplete options exercise runtime validation.
        expect(() => new AddonWrapper({
            name: 'foo',
            importPath: 'bar'
        })).toThrowErrorMatchingSnapshot();
    });

    it('should throw with wrong es flag', function() {
        // @ts-expect-error Intentionally incomplete options exercise runtime validation.
        expect(() => new AddonWrapper({
            name: 'foo',
            importPath: 'bar',
            type: 'x'
        })).toThrowErrorMatchingSnapshot();
    });
});


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
