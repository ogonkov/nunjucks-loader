import {assertHtml as expect} from './assert-html.js';
import {renders} from './assets-renders.js';
import {describe, test, it} from './node-testing.js';

for (const [mode, compiler] of renders) {
    const loaderOptions = {
        esModule: mode === 'esm'
    };

describe(`Assets (${mode})`, function() {
    test('should load static assets', async function() {
        const output = await compiler('fixtures/assets/template.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });

    test('should load exported static assets', async function() {
        const output = await compiler('fixtures/assets/template-as.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });

    test('should load dynamic assets', async function() {
        const output = await compiler('fixtures/assets/dynamic.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });

    test('should load dynamic assets with trailing slashes', async function() {
        const output = await compiler('fixtures/assets/dynamic-trailing-slash.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });

    test('should load exported dynamic assets', async function() {
        const output = await compiler('fixtures/assets/dynamic-as.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });

    it('should load variables', async function() {
        const output = await compiler('fixtures/assets/dynamic-variable.njk', loaderOptions);

        await expect(output(), this).resolves.toMatchSnapshot();
    });
});

}
