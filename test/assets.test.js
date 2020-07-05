import compiler from './compiler';

const loaderOptions = {
    esModule: __USE_ES__,
    assetsPaths: [
        'test/fixtures/django_project/app_example/static'
    ]
};

describe('Assets', function() {
    test('should load static assets', async function() {
        const output = await compiler('fixtures/assets/template.njk', loaderOptions);

        await expect(output()).resolves.toMatchSnapshot();
    });

    test('should load exported static assets', async function() {
        const output = await compiler('fixtures/assets/template-as.njk', loaderOptions);

        await expect(output()).resolves.toMatchSnapshot();
    });

    test('should load dynamic assets', async function() {
        const output = await compiler('fixtures/assets/dynamic.njk', loaderOptions);

        await expect(output()).resolves.toMatchSnapshot();
    });

    test('should load exported dynamic assets', async function() {
        const output = await compiler('fixtures/assets/dynamic-as.njk', loaderOptions);

        await expect(output()).resolves.toMatchSnapshot();
    });
});
