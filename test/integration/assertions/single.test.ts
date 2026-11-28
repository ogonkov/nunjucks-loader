import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {test} from 'node:test';

import renderCjs from '#dist/cjs/single.cjs';
import renderEsm from '#dist/esm/single.cjs';

for (const [mode, render] of [['cjs', renderCjs], ['esm', renderEsm]] as const) {
    test(`esModule=${mode === 'esm'}: renders a single template`, async () => {
        const expected = await readFile(path.resolve('../../expected/single.html'), 'utf8');
        const actual = await render({
            title: 'App',
            href: 'https://example.com'
        });

        // Fixtures and expectations can have different checkout line endings.
        assert.equal(actual.replace(/\r\n/g, '\n'), expected.replace(/\r\n/g, '\n'));
    });
}
