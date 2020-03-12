import {getFirstExistedPath} from './get-first-existed-path';

test('should throw for non-existed path', async function() {
    await expect(getFirstExistedPath(['foo.js', 'bar.js'])).rejects.toThrow(
        'Template not found'
    )
});
