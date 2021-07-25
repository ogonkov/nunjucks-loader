import {ImportPart} from './ImportPart';


export class ImportLiteral extends ImportPart {
    toString() {
        return `"${this.value}"`;
    }

    toGlob() {
        return String(this.value);
    }
}
