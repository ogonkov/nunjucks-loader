import {ImportLiteral} from './ImportLiteral';
import {normalizeTrailingSlash} from './normalize-trailing-slash';


it('should append trailing slash', function() {
    const literal = new ImportLiteral('b/');
    expect(normalizeTrailingSlash('a/b', literal)).toBe('a/b/');
});

it('should should preserve trailing slash', function() {
    const literal = new ImportLiteral('b/');
    expect(normalizeTrailingSlash('a/b/', literal)).toBe('a/b/');
});

it('should unquote path', function() {
    const literal = new ImportLiteral('b/');
    expect(normalizeTrailingSlash('"a/b"', literal)).toBe('a/b/');
});
