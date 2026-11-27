import {describe, expect, test} from '@jest/globals';
import {Environment} from 'nunjucks';

import {StaticExtension} from './StaticExtension';
import {ASSETS_KEY} from './contants';
import type {AssetMeta} from './types';

function render(template: string, assets: AssetMeta[]) {
    const environment = new Environment();
    environment.addExtension('StaticExtension', new StaticExtension());

    const context = {
        [ASSETS_KEY]: Object.fromEntries(assets.map((asset, index) => [index, asset]))
    };

    return new Promise<string | null>(function(resolve, reject) {
        environment.renderString(template, context, function(error, result) {
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        });
    });
}

describe('StaticExtension', function() {
    test('should render a static asset URL', async function() {
        const output = render('<img src="{% static "logo.svg" %}">', [
            {path: 'logo.svg', module: '/assets/logo.svg'}
        ]);

        await expect(output).resolves.toBe('<img src="/assets/logo.svg">');
    });

    test('should render an aliased asset URL', async function() {
        const output = render('{% static "logo.svg" as logo %}<img src="{{ logo }}">', [
            {path: 'logo.svg', module: '/assets/logo.svg'}
        ]);

        await expect(output).resolves.toBe('<img src="/assets/logo.svg">');
    });

    test('should reject rendering when an asset factory throws', async function() {
        const output = render('{% static "logo.svg" %}', [
            {
                path: /^logo\.svg$/,
                module() {
                    throw new Error('Asset factory failed');
                }
            }
        ]);

        await expect(output).rejects.toThrow('Asset factory failed');
    });

    test('should render a dynamic asset URL', async function() {
        const output = render('{% set name = "logo" %}{% static name + ".svg" %}', [
            {
                path: /(.+)\.svg$/,
                async module(name) {
                    return `/assets/${name}.svg`;
                }
            }
        ]);

        await expect(output).resolves.toBe('/assets/logo.svg');
    });

    test('should render an aliased dynamic asset URL', async function() {
        const output = render('{% set name = "logo" %}{% static name + ".svg" as logo %}<img src="{{ logo }}">', [
            {
                path: /(.+)\.svg$/,
                async module(name) {
                    return `/assets/${name}.svg`;
                }
            }
        ]);

        await expect(output).resolves.toBe('<img src="/assets/logo.svg">');
    });
});
