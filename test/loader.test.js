import path from 'path';
import compiler from './compiler';

describe('Simple compilation', function() {
    test('should compile single files', async function() {
        const output = await compiler('fixtures/single.njk');

        expect(output({
            title: 'App',
            href: 'https://example.com'
        })).toMatchSnapshot();
    });

    test('should compile templates with inheritance', async function() {
        const output = await compiler('fixtures/child.njk');

        expect(output({
            parent_link: 'https://example.com/1',
            child_link: 'https://example.com/2'
        })).toMatchSnapshot();
    });

    test('should inherit from parent with super', async function() {
        const output = await compiler('fixtures/inheritance.njk');

        expect(output({
            name: 'Joe'
        })).toMatchSnapshot();
    });

    test('should compile templates with multiple includes', async function() {
        const output = await compiler('fixtures/multiple-same-includes.njk');

        expect(output({
            parent_link: 'https://example.com/parent',
            text: 'Button'
        })).toMatchSnapshot()
    });

    test('should compile templates with filters', async function() {
        const output = await compiler('fixtures/builtin-filters.njk');

        expect(output({
            text: 'nunjucks foolter'
        })).toMatchSnapshot();
    });

    test('should compile builtin tags', async function() {
        const output = await compiler('fixtures/builtin-tags.njk');

        expect(output({
            tired: true
        })).toMatchSnapshot();
    });

    test('should compile macro', async function() {
        const output = await compiler('fixtures/macro.njk');

        expect(output()).toMatchSnapshot();
    });

    test('should install Jinja compat', async function() {
        const output = await compiler('fixtures/jinja-syntax.njk', {
            jinjaCompat: true
        });

        expect(output({})).toMatchSnapshot();
    })
});

describe('Advanced compilation', function() {
    test('should compile templates with non-relative paths', async function() {
        const output = await compiler('fixtures/django_project/app_example/templates/main/main.njk', {
            searchPaths: 'test/fixtures/django_project/app_example/templates'
        });

        expect(output()).toMatchSnapshot();
    });

    test('should compile with given globals', async function() {
        const output = await compiler('fixtures/globals.njk', {
            globals: {
                foobar: path.join(__dirname, './fixtures/globals.js')
            }
        });

        expect(output()).toMatchSnapshot();
    });

    test('should compile globals in parent templates', async function() {
        const output = await compiler('fixtures/globals_child_template.njk', {
            globals: {
                foobar: path.join(__dirname, './fixtures/globals.js')
            }
        });

        expect(output()).toMatchSnapshot();
    });

    test('should compile custom tags', async function() {
        const output = await compiler('fixtures/custom-extension.njk', {
            extensions: {
                RemoteExtension: path.join(__dirname, './fixtures/RemoteExtension.js')
            }
        });

        expect(output()).toMatchSnapshot();
    });
});
