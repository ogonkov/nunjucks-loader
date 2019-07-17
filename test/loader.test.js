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

    test('should compile templates with multiple includes', async function() {
        const output = await compiler('fixtures/multiple-same-includes.njk');

        expect(output({
            parent_link: 'https://example.com/parent',
            text: 'Button'
        })).toMatchSnapshot()
    });
});
