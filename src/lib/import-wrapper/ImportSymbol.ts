import {ImportPart} from './ImportPart';


export class ImportSymbol extends ImportPart {
    get className(): 'ImportSymbol' {
        return 'ImportSymbol';
    }

    toString() {
        return String(this.value);
    }

    toGlob() {
        return '*';
    }
}
