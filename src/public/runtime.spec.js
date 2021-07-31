import runtime from './runtime';

describe('render', function() {
    test('should render template', function() {
        const contextSpy = jest.fn();

        const precompiled = {
            root(env, context, frame, runtime, cb) {
                contextSpy(context.ctx);

                cb(null, 'Foo');
            }
        };
        const tpl = runtime({}, {
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
