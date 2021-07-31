import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {optimizeImportLiterals} from './optimize-import-literals';


it('should squash literals', function() {
    const importValue = [
        new ImportSymbol('a'),
        new ImportSymbol('b'),
        new ImportLiteral('c'),
        new ImportLiteral('d'),
        new ImportSymbol('e'),
        new ImportLiteral('f'),
    ];
    const optimizedLiterals = optimizeImportLiterals(importValue);

    expect(optimizedLiterals).toHaveLength(5);
    expect(String(optimizedLiterals)).toBe('a,b,"cd",e,"f"');
});
