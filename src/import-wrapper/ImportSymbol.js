import {ImportPart} from './ImportPart';


export class ImportSymbol extends ImportPart {
    get className() {
        return 'ImportSymbol';
    }

    toString() {
        return String(this.value);
    }

    toGlob() {
        return '*';
    }
}
