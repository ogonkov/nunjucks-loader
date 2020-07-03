import compiler from './compiler';

describe('Assets', function() {
    test('should load static assets', async function() {
        const output = await compiler('fixtures/assets/template.njk', {
            assetsPaths: [
                'test/fixtures/django_project/app_example/static'
            ]
        });

        await expect(output()).resolves.toMatchSnapshot();
    });

    test('should load dynamic assets', async function() {
        const output = await compiler('fixtures/assets/dynamic.njk', {
            assetsPaths: [
                'test/fixtures/django_project/app_example/static'
            ]
        });

        await expect(output()).resolves.toMatchSnapshot();
    });
});
