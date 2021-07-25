export class ImportPart {
    constructor(value) {
        if (typeof value !== 'string') {
            throw new TypeError(
                `${this.constructor.name}: value should be a string`
            );
        }

        if (value === '') {
            throw new TypeError(
                `${this.constructor.name}: value should not be empty`
            );
        }

        this.value = value;
    }

    get [Symbol.toStringTag]() {
        return this.constructor.name;
    }

    valueOf() {
        return this.value;
    }
}
