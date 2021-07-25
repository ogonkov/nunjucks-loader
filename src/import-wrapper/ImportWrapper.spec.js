import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {ImportWrapper} from './ImportWrapper';


describe('constructor', function() {
    it('should accept literals and symbols', function() {
        expect(() => new ImportWrapper([
            new ImportLiteral('a'),
            new ImportSymbol('b')
        ])).not.toThrowError();
    });

    it('should throw for wrong args', function() {
        expect(() => new ImportWrapper([
            new ImportLiteral('a'),
            new ImportSymbol('b'),
            'c'
        ])).toThrowError('ImportWrapper: all parts should be a symbol or literal instances');
    });
});

describe('push', function() {
    it('should insert new part', function() {
        const importPath = new ImportWrapper();
        importPath.addSymbol('a').addLiteral('b');

        importPath.push(new ImportSymbol('c'));

        expect(importPath.toString()).toBe('a + "b" + c');
    });
});

describe('shift', function() {
    it('should return first item', function() {
        const importPath = new ImportWrapper();
        importPath.addSymbol('a').addLiteral('b');

        expect(importPath.shift().toString()).toBe('a');
    });
});

describe('unshift', function() {
    it('should prepend items', function() {
        const importPath = new ImportWrapper();
        importPath.addLiteral('b');
        importPath.unshift(new ImportSymbol('a'));

        expect(importPath.toString()).toBe('a + "b"');
    });
});

describe('concat', function() {
    it('should return new instance', function() {
        const importPath = new ImportWrapper();
        const clone = importPath.concat();

        expect(importPath).not.toBe(clone);
    });
});

describe('startsWith', function() {
    it('should return bool with literals', function() {
        const templateImport = new ImportWrapper();
        templateImport.addLiteral('a').addLiteral('b').addSymbol('c');

        expect(templateImport.startsWith('abc')).toBe(false);
        expect(templateImport.startsWith('ab')).toBe(true);
        expect(templateImport.startsWith('a')).toBe(true);
    });

    it('should return bool with symbol', function() {
        const templateImport = new ImportWrapper();
        templateImport.addSymbol('a').addLiteral('b').addSymbol('c');

        expect(templateImport.startsWith('a')).toBe(false);
    });
});

describe('isDynamic', function() {
    it('should detect paths with symbols', function() {
        const templateImport = new ImportWrapper();
        templateImport.addLiteral('a');

        expect(templateImport.isDynamic()).toBe(false);

        templateImport.addSymbol('b');
        expect(templateImport.isDynamic()).toBe(true);
    });
});

describe('toString', function() {
    let templateImport;
    beforeEach(function() {
        templateImport = new ImportWrapper();
        templateImport.addSymbol('a').addLiteral('b');
    });

    it('should return import string', function() {
        expect(templateImport.toString()).toBe(
            'a + "b"'
        );
    });

    it('should return raw string', function() {
        expect(templateImport.toGlob()).toBe('*b');
    });
});
