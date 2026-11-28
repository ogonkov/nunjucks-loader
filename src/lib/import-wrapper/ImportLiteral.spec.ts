import {describe, expect, it} from '@jest/globals';

import {ImportLiteral} from './ImportLiteral';


describe('toString', function() {
    it('should return quoted string', function() {
        expect(new ImportLiteral('a').toString()).toBe('"a"');
    });
});

describe('toGlob', function() {
    it('should return raw string', function() {
        expect(new ImportLiteral('a').toGlob()).toBe('a');
    });
});
