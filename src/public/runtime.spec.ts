import {describe, expect, jest, test} from '@jest/globals';
import type {ContextBlock} from 'nunjucks';

import runtime from './runtime';

describe('render', function() {
    test('should render template', function() {
        const contextSpy = jest.fn();

        const precompiled: {root: ContextBlock} = {
            root(env, context, frame, runtime, cb) {
                contextSpy(context.ctx);

                cb(null, 'Foo');
            }
        };
        const tpl = runtime({}, {
            globals: undefined,
            extensions: undefined,
            filters: undefined,
            templates: {
                'foo.njk': precompiled
            }
        });

        expect(tpl.render('foo.njk', {
            username: 'Joe Doe'
        })).toBe('Foo');
        expect(contextSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                username: 'Joe Doe'
            })
        );
    });
});

describe('isAsync', function() {
    test('should return true with async filters', function() {
        const tpl = runtime({}, {
            globals: undefined,
            extensions: undefined,
            templates: undefined,
            filters: {
                foo: {
                    async: true,
                    module: ''
                }
            }
        });

        expect(tpl.isAsync()).toBe(true);
    });
});
