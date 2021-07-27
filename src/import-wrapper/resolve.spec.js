import {ImportWrapper} from './ImportWrapper';
import {resolve} from './resolve';


it('should prepend import', function() {
    const path = 'a';
    const templateImport = new ImportWrapper();
    templateImport.addSymbol('b').addLiteral('c');

    const nextPath = resolve(path, templateImport);
    expect(nextPath.toString()).toMatch(/a(\/|\\)" \+ b \+ "c"$/);
    expect(nextPath.toGlob()).toMatch(/a(\/|\\)\*c/);
});

it('should prepend to literal', function() {
    const path = 'a';
    const templateImport = new ImportWrapper();
    templateImport.addLiteral('b').addSymbol('c');

    const nextPath = resolve(path, templateImport);
    expect(nextPath.toString()).toMatch(/a(\/|\\)b" \+ c$/);
    expect(nextPath.toGlob()).toMatch(/a(\/|\\)b\*/);
});
