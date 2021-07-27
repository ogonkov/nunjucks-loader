import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {getType} from './get-type';


it('should return type of instance tag', function() {
    const literalInstance = new ImportLiteral('a');
    expect(getType(literalInstance)).toBe('ImportLiteral');

    const symbolInstance = new ImportSymbol('b');
    expect(getType(symbolInstance)).toBe('ImportSymbol');
});
