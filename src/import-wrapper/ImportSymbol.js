import {ImportPart} from './ImportPart';


export class ImportSymbol extends ImportPart {
    toString() {
        return String(this.value);
    }

    toGlob() {
        return '*';
    }
}
