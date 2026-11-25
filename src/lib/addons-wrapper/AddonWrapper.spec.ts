import {describe, expect, it} from '@jest/globals';

import {AddonWrapper} from './AddonWrapper';

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
