/* global __USE_ES__ */

import path from 'path';

import compiler from './compiler';

const loaderBaseOptions = {
    esModule: __USE_ES__
};

describe('Simple compilation', function() {
    test('should compile single files', async function() {
        const output = await compiler('fixtures/single.njk', loaderBaseOptions);

        expect(output({
            title: 'App',
            href: 'https://example.com'
        })).toMatchSnapshot();
    });

    test('should compile templates with inheritance', async function() {
        const output = await compiler('fixtures/child.njk', loaderBaseOptions);

        expect(output({
            parent_link: 'https://example.com/1',
            child_link: 'https://example.com/2'
        })).toMatchSnapshot();
    });

    test('should inherit from parent with super', async function() {
        const output = await compiler('fixtures/inheritance.njk', loaderBaseOptions);

        expect(output({
            name: 'Joe'
        })).toMatchSnapshot();
    });

    test('should compile templates with multiple includes', async function() {
        const output = await compiler('fixtures/multiple-same-includes.njk', loaderBaseOptions);

        expect(output({
            parent_link: 'https://example.com/parent',
            text: 'Button'
        })).toMatchSnapshot()
    });

    test('should compile templates with filters', async function() {
        const output = await compiler('fixtures/builtin-filters.njk', loaderBaseOptions);

        expect(output({
            text: 'nunjucks foolter'
        })).toMatchSnapshot();
    });

    test('should compile builtin tags', async function() {
        const output = await compiler('fixtures/builtin-tags.njk', loaderBaseOptions);

        expect(output({
            tired: true
        })).toMatchSnapshot();
    });

    test('should compile macro', async function() {
        const output = await compiler('fixtures/macro.njk', loaderBaseOptions);

        expect(output()).toMatchSnapshot();
    });

    test('should install Jinja compat', async function() {
        const output = await compiler('fixtures/jinja-syntax.njk', {
            ...loaderBaseOptions,
            jinjaCompat: true
        });

        expect(output({})).toMatchSnapshot();
    })
});

describe('Advanced compilation', function() {
    test('should compile templates with non-relative paths', async function() {
        const output = await compiler('fixtures/django_project/app_example/templates/main/main.njk', {
            ...loaderBaseOptions,
            searchPaths: [
                'test/fixtures/django_project/app_example/templates',
                '.'
            ]
        });

        expect(output()).toMatchSnapshot();
    });

    describe('globals', function() {
        const loaderOptions = {
            ...loaderBaseOptions,
            globals: {
                foobar: path.join(__dirname, './fixtures/globals/globals.js')
            }
        };

        test('should compile with given globals', async function() {
            const output = await compiler('fixtures/globals/base.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile globals in parent templates', async function() {
            const output = await compiler('fixtures/globals/child.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile multiple instances of same global', async function() {
            const output = await compiler('fixtures/globals/multiple.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        })
    });

    describe('extensions', function() {
        const loaderOptions = {
            ...loaderBaseOptions,
            extensions: {
                RemoteExtension: path.join(__dirname, './fixtures/extensions/RemoteExtension.js')
            }
        };

        test('should compile custom tags', async function() {
            const output = await compiler('fixtures/extensions/base.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile custom tags from parent template', async function() {
            const output = await compiler('fixtures/extensions/child.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile multiple instances of same tag', async function() {
            const output = await compiler('fixtures/extensions/multiple.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile async extensions', async function() {
            const output = await compiler('fixtures/extensions/multiple.njk', {
                ...loaderBaseOptions,
                extensions: {
                    RemoteExtension: path.join(__dirname, './fixtures/extensions/RemoteAsyncExtension.js')
                }
            });

            jest.useFakeTimers();

            const asyncRender = output();

            jest.runAllTimers();

            await expect(asyncRender).resolves.toMatchSnapshot();

            jest.useRealTimers();
        });
    });

    describe('filters', function() {
        const loaderOptions = {
            ...loaderBaseOptions,
            filters: {
                foo: path.join(__dirname, './fixtures/filters/foo-filter.js')
            }
        };

        test('should compile single filter instance', async function() {
            const output = await compiler('fixtures/filters/single.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile multiple instances of same filter', async function() {
            const output = await compiler('fixtures/filters/multiple.njk', loaderOptions);

            expect(output()).toMatchSnapshot();
        });

        test('should compile filters in inherited templates', async function() {
            const output = await compiler('fixtures/filters/children.njk', loaderOptions);

            expect(output({
                title: 'Foobar',
                foo_var: 42
            })).toMatchSnapshot()
        });

        test('should compile async filters', async function() {
            const output = await compiler('fixtures/filters/children.njk', {
                ...loaderBaseOptions,
                filters: {
                    foo: path.join(__dirname, './fixtures/filters/foo-filter-async.js')
                }
            });

            jest.useFakeTimers();

            const asyncRender = output({
                title: 'Foobar',
                foo_var: 100500
            });

            jest.runAllTimers();

            const result = await asyncRender;

            expect(result).toMatchSnapshot();

            jest.useRealTimers();
        });
    });

    describe('loaderClass', function() {
        it('should overrider templates loader', async function () {
            const output = await compiler('fixtures/base.njk', {
                loaderClass: require.resolve('./fixtures/template-loader/TemplateLoader.js')
            });

            expect(output()).toBe('<p>Template from custom loader</p>');
        });
    });
});
