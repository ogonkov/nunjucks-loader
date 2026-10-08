export class ImportPart {
    value: string;

    constructor(value: unknown) {
        if (typeof value !== 'string') {
            throw new TypeError(
                `${this.className}: value should be a string`
            );
        }

        if (value === '') {
            throw new TypeError(
                `${this.className}: value should not be empty`
            );
        }

        this.value = value;
    }

    get className() {
        return this.constructor.name;
    }

    get [Symbol.toStringTag]() {
        return this.className;
    }

    valueOf() {
        return this.value;
    }
}
