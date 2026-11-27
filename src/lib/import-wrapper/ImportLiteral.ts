import {ImportPart} from './ImportPart';


export class ImportLiteral extends ImportPart {
    get className() {
        return 'ImportLiteral' as const;
    }

    toString() {
        return `"${this.value}"`;
    }

    toGlob() {
        return String(this.value);
    }
}
