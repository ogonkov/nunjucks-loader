import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import type {TestContext} from 'node:test';

export function assertHtml(actual: string | Promise<string>, t: TestContext) {
    function toMatchSnapshot(rendered: string): void {
        const name = t.fullName
            .replace(/ \((?:cjs|esm)\)/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        const expected = readFileSync(path.resolve('../../expected', `${name}.html`), 'utf8');

        // Fixtures and expectations can have different checkout line endings.
        assert.equal(rendered.replace(/\r\n/g, '\n'), expected.replace(/\r\n/g, '\n'));
    }

    return {
        toMatchSnapshot(): void {
            assert.ok(typeof actual === 'string', 'Use .resolves for asynchronous rendering');
            toMatchSnapshot(actual);
        },
        resolves: {
            async toMatchSnapshot(): Promise<void> {
                toMatchSnapshot(await actual);
            }
        }
    };
}
