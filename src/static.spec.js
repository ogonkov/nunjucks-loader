import staticGlobal from './static';

test('returns imported symbol', function() {
    const mock = 'image.png';

    expect(staticGlobal(mock)).toBe(mock);
});

test('invoke imported symbol with arguments', function() {
    const mock = jest.fn();
    mock.mockReturnValue('image.png');

    expect(staticGlobal(mock, 1)).toBe('image.png');
    expect(mock).toHaveBeenCalledWith(1);
});
