import {ImportPart} from './ImportPart';


export class ImportSymbol extends ImportPart {
    get className() {
        return 'ImportSymbol' as const;
    }

    toString() {
        return String(this.value);
    }

    toGlob() {
        return '*';
    }
}
