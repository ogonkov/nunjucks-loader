import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

import {assertHtml as expect} from './assert-html.js';
import {renders} from './loader-renders.js';
import {describe, test} from './node-testing.js';
import type {BuildStats} from './types.js';

for (const [mode, compiler] of renders) {
    const loaderBaseOptions = {
        esModule: mode === 'esm'
    };

describe(`Simple compilation (${mode})`, function() {
    test('should compile single files', async function() {
        const output = await compiler('fixtures/single.njk', loaderBaseOptions);

        expect(output({
            title: 'App',
            href: 'https://example.com'
        }), this).toMatchSnapshot();
    });

    test('should compile templates with inheritance', async function() {
        const output = await compiler('fixtures/child.njk', loaderBaseOptions);

        expect(output({
            parent_link: 'https://example.com/1',
            child_link: 'https://example.com/2'
        }), this).toMatchSnapshot();
    });

    test('should inherit from parent with super', async function() {
        const output = await compiler('fixtures/inheritance.njk', loaderBaseOptions);

        expect(output({
            name: 'Joe'
        }), this).toMatchSnapshot();
    });

    test('should compile templates with multiple includes', async function() {
        const output = await compiler('fixtures/multiple-same-includes.njk', loaderBaseOptions);

        expect(output({
            parent_link: 'https://example.com/parent',
            text: 'Button'
        }), this).toMatchSnapshot();
    });

    test('should compile templates with filters', async function() {
        const output = await compiler('fixtures/builtin-filters.njk', loaderBaseOptions);

        expect(output({
            text: 'nunjucks foolter'
        }), this).toMatchSnapshot();
    });

    test('should compile builtin tags', async function() {
        const output = await compiler('fixtures/builtin-tags.njk', loaderBaseOptions);

        expect(output({
            tired: true
        }), this).toMatchSnapshot();
    });

    test('should compile macro', async function() {
        const output = await compiler('fixtures/macro.njk', loaderBaseOptions);

        expect(output(), this).toMatchSnapshot();
    });

    test('should install Jinja compat', async function() {
        const output = await compiler('fixtures/jinja-syntax.njk', loaderBaseOptions);

        expect(output({}), this).toMatchSnapshot();
    })
});

describe(`Advanced compilation (${mode})`, function() {
    test('should compile templates with non-relative paths', async function() {
        const output = await compiler('fixtures/django_project/app_example/templates/main/main.njk', loaderBaseOptions);

        expect(output(), this).toMatchSnapshot();
    });

    test('should output warning for dynamic templates imports', async function() {
        const stats: BuildStats = JSON.parse(await readFile('dist/stats.json', 'utf8'));
        const warnings = stats.children.find(child => child.name === `${mode}-warnings`)?.warnings;

        assert.ok(warnings?.some(warning => warning.message.includes('Skipping "test/fixtures/assets/" + name.')));
        assert.ok(warnings?.some(warning => warning.message.includes('Skipping "test/fixtures/" + macroName + "-macro.njk".')));
    });

    describe('globals', function() {
        test('should compile with given globals', async function() {
            const output = await compiler('fixtures/globals/base.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile globals in parent templates', async function() {
            const output = await compiler('fixtures/globals/child.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile multiple instances of same global', async function() {
            const output = await compiler('fixtures/globals/multiple.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        })
    });

    describe('extensions', function() {
        test('should compile custom tags', async function() {
            const output = await compiler('fixtures/extensions/base.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile custom tags from parent template', async function() {
            const output = await compiler('fixtures/extensions/child.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile multiple instances of same tag', async function() {
            const output = await compiler('fixtures/extensions/multiple.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile async extensions', async function() {
            const output = await compiler('fixtures/extensions/multiple.njk?async', loaderBaseOptions);

            await expect(output(), this).resolves.toMatchSnapshot();
        });
    });

    describe('filters', function() {
        test('should compile single filter instance', async function() {
            const output = await compiler('fixtures/filters/single.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile multiple instances of same filter', async function() {
            const output = await compiler('fixtures/filters/multiple.njk', loaderBaseOptions);

            expect(output(), this).toMatchSnapshot();
        });

        test('should compile filters in inherited templates', async function() {
            const output = await compiler('fixtures/filters/children.njk', loaderBaseOptions);

            expect(output({
                title: 'Foobar',
                foo_var: 42
            }), this).toMatchSnapshot();
        });

        test('should compile async filters', async function() {
            const output = await compiler('fixtures/filters/children.njk?async', loaderBaseOptions);

            const asyncRender = output({
                title: 'Foobar',
                foo_var: 100500
            });

            const result = await asyncRender;

            expect(result, this).toMatchSnapshot();
        });
    });
});

}
