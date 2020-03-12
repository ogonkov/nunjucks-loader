import {getErrorCopy} from './get-error-copy';

describe('getErrorCopy', function() {
    test('returns copy of the Error', function() {
        const err = new Error('Foobar');
        err.code = 100500;

        const result = getErrorCopy(err);

        expect(result).toBeInstanceOf(Error);
        expect(result).toHaveProperty('code', 100500);
    });
});
