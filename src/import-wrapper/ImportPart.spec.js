import {ImportPart} from './ImportPart';


function getInstance(value) {
    class Foobar extends ImportPart {}
    return new Foobar(value);
}

it('should throw with wrong value', function() {
    expect(() => getInstance()).toThrowError(
        'Foobar: value should be a string'
    );
});

it('should have proper tag', function() {
    expect(Object.prototype.toString.call(getInstance('foo'))).toBe(
        '[object Foobar]'
    );
});

it('should return raw string', function() {
    expect(getInstance('foo').valueOf()).toBe('foo');
});
