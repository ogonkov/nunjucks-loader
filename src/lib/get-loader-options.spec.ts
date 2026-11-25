import {expect, it, jest} from '@jest/globals';
import Ajv from 'ajv';
import type {LoaderContext} from 'webpack';

import {getLoaderOptions} from './get-loader-options';
import schema from './schema';
import type {LoaderCallback, NullableLoaderOptions} from './types';

const validate = new Ajv({allowUnionTypes: true}).compile(schema);

function readOptions(options: NullableLoaderOptions) {
    const callback = jest.fn<LoaderCallback>();
    // Only getOptions is used by this helper; validate the supplied options as webpack does.
    const loader = {
        getOptions() {
            if (!validate(options)) {
                throw new Error('Invalid loader options');
            }
            return options;
        }
    } as LoaderContext<NullableLoaderOptions>;

    return {result: getLoaderOptions(loader, callback), callback};
}

it('treats null options as omitted and applies defaults', function() {
    const options = Object.fromEntries(Object.keys(schema.properties).map(key => [key, null]));
    const {result, callback} = readOptions(options);

    expect(callback).not.toHaveBeenCalled();
    expect(result).toEqual({
        jinjaCompat: false,
        searchPaths: '.',
        assetsPaths: '.',
        globals: {},
        extensions: {},
        filters: {},
        esModule: false
    });
});

it('removes null tag delimiters and preserves explicit option values', function() {
    const {result, callback} = readOptions({
        dev: false,
        autoescape: false,
        searchPaths: [],
        tags: {blockStart: null, variableStart: '[[', variableEnd: ']]'}
    });

    expect(callback).not.toHaveBeenCalled();
    expect(result).toMatchObject({
        dev: false,
        autoescape: false,
        searchPaths: [],
        tags: {variableStart: '[[', variableEnd: ']]'}
    });
    expect(result?.tags).not.toHaveProperty('blockStart');
});

it('keeps null array items and addon paths invalid', function() {
    expect(validate({searchPaths: [null]})).toBe(false);
    expect(validate({assetsPaths: [null]})).toBe(false);
    expect(validate({filters: {example: null}})).toBe(false);
});
