import {WebpackPrecompiledLoader} from './WebpackPrecompiledLoader';

const precompiledTemplateMock = {
    root() {}
};

describe('WebpackPrecompiledLoader', function() {
    describe('getSource', function() {
        describe('template not found', function() {
            test('not precompiled', function() {
                const loader = new WebpackPrecompiledLoader();

                expect(loader.getSource('foo.njk')).toBeNull();
            });

            test('not precompiled on Windows', function() {
                const loader = new WebpackPrecompiledLoader({
                    '/foo.njk': precompiledTemplateMock
                }, {
                    isWindows: true
                });

                expect(loader.getSource('bar.njk')).toBeNull();
                expect(loader.getSource('foo.njk')).toEqual({
                    src: {
                        type: 'code',
                        obj: precompiledTemplateMock
                    },
                    path: 'foo.njk'
                });
            });
        });

        describe('template return', function() {
            test('returns precompiled template', function() {
                const loader = new WebpackPrecompiledLoader({
                    'foo.njk': precompiledTemplateMock
                });

                expect(loader.getSource('foo.njk')).toEqual({
                    src: {
                        type: 'code',
                        obj: precompiledTemplateMock
                    },
                    path: 'foo.njk'
                });
            });

            test('returns precompiled template on Windows', function() {
                const loader = new WebpackPrecompiledLoader({
                    '/foo.njk': precompiledTemplateMock
                }, {
                    isWindows: true
                });

                expect(loader.getSource('foo.njk')).toEqual({
                    src: {
                        type: 'code',
                        obj: precompiledTemplateMock
                    },
                    path: 'foo.njk'
                });
            });
        });
    });
});
