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
        });
    });
});
