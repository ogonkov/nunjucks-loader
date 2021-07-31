import {getRegexMatches} from './get-regex-matches';

it('should return matches', function() {
    const matches = getRegexMatches('foobar', /f([^b]+)b([^b]+)/g);
    expect(matches).toEqual(['oo', 'ar']);
});

it('should return empty array when no matches', function() {
    const matches = getRegexMatches('quxbaz', /f([^b]+)b([^b]+)/g);
    expect(matches).toEqual([]);
});
