import {ImportPart} from './ImportPart';


export class ImportLiteral extends ImportPart {
    get className(): 'ImportLiteral' {
        return 'ImportLiteral';
    }

    toString() {
        return `"${this.value}"`;
    }

    toGlob() {
        return String(this.value);
    }
}
