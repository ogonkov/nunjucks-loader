import {ImportSymbol} from './ImportSymbol';


describe('toString', function() {
    it('should return raw string', function() {
        expect(new ImportSymbol('a').toString()).toBe('a');
    });
});

describe('toGlob', function() {
    it('should return star', function() {
        expect(new ImportSymbol('a').toGlob()).toBe('*');
    });
});
