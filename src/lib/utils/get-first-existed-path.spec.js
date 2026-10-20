import path from 'path';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getFirstExistedPath} from './get-first-existed-path';

test('should throw for non-existed path', async function() {
    await expect(getFirstExistedPath([
        new ImportWrapper().addLiteral('foo.js'),
        new ImportWrapper().addLiteral('bar.js')
    ])).rejects.toThrow(
        'Path not found'
    )
});


test('should resolve dynamic paths with native separators', async function() {
    const prefix = path.resolve(__dirname,
        '../../../test/fixtures/django_project/app_example/static/foo/bar/dynamic-'
    );
    const dynamicPath = new ImportWrapper()
        .addLiteral(prefix)
        .addSymbol('name')
        .addLiteral('-1.md');

    await expect(getFirstExistedPath([dynamicPath])).resolves.toBe(dynamicPath);
});


(process.platform === 'win32' ? test.skip : test)('should preserve POSIX glob escaping', async function() {
    const prefix = path.resolve(__dirname,
        '../../../test/fixtures/django_project/app_example/static/foo/bar/dynamic-'
    ).replace('dynamic-', 'dynamic\\-');
    const dynamicPath = new ImportWrapper()
        .addLiteral(prefix)
        .addSymbol('name')
        .addLiteral('-1.md');

    await expect(getFirstExistedPath([dynamicPath])).resolves.toBe(dynamicPath);
});
