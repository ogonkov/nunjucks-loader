import {getStringBase64Hash} from '../utils/get-string-base64-hash';
import {toRegExpSource} from '../utils/to-regexp-source';
import {unquote} from '../utils/unquote';

import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {getType} from './get-type';
import {isSymbol} from './is-symbol';
import {optimizeImportLiterals} from './optimize-import-literals';
import {throwNotSymbolOrLiteral} from './throw-not-symbol-or-literal';

function setImportValue(instance: ImportWrapper, importValue: ImportLiteralOrSymbol[]) {
    instance.importValue = importValue;
    instance._optimizedImportValue = optimizeImportLiterals(importValue);
}

export type ImportLiteralOrSymbol = ImportLiteral | ImportSymbol;

type MapCallback = (value: ImportLiteralOrSymbol) => unknown;

/**
 * Wrapper for manage import strings
 */
export class ImportWrapper {
    importValue!: ImportLiteralOrSymbol[];
    _optimizedImportValue!: ImportLiteralOrSymbol[];

    constructor(importValue: unknown | ImportLiteralOrSymbol[] = []) {
        throwNotSymbolOrLiteral('ImportWrapper', importValue);

        let value: ImportLiteralOrSymbol[] = [];
        value = value.concat(importValue);

        setImportValue(this, value);
    }

    push(...value: ImportLiteralOrSymbol[]) {
        throwNotSymbolOrLiteral('ImportWrapper#push', value);

        setImportValue(this, [
            ...this.importValue,
            ...value
        ]);

        return this;
    }

    addSymbol(...value: string[]) {
        return this.push(...value.map((value) => new ImportSymbol(value)));
    }

    addLiteral(...value: string[]) {
        return this.push(...value.map((value) => new ImportLiteral(value)));
    }

    shift() {
        const [item, ...importValue] = this.importValue;
        setImportValue(this, importValue);

        return item;
    }

    unshift(...value: ImportLiteralOrSymbol[]) {
        if (value.length === 0) {
            return this;
        }

        throwNotSymbolOrLiteral('ImportWrapper#unshift', value);

        setImportValue(this, [
            ...value,
            ...this.importValue
        ]);

        return this;
    }

    concat(...value: ImportLiteralOrSymbol[]) {
        return new ImportWrapper([
            ...this.importValue,
            ...value
        ]);
    }

    map(callback: MapCallback) {
        return new ImportWrapper(this.importValue.map(callback));
    }

    startsWith(str: string) {
        const [item] = this._optimizedImportValue;
        if (getType(item) !== 'ImportLiteral' || item === void 0) {
            return false;
        }

        return item.value.startsWith(str);
    }

    isDynamic() {
        return this.importValue.some(isSymbol);
    }

    getHash() {
        return getStringBase64Hash(this.toString());
    }

    toString() {
        const string = this.importValue.join(' + ');
        if (this.isDynamic()) {
            return string;
        }

        if (this.importValue.length === 1) {
            return unquote(string);
        }

        return string;
    }

    toGlob() {
        return this.importValue.reduce(function toGlob(glob, item) {
            if (!glob) {
                return item.toGlob();
            }

            return `${glob}${item.toGlob()}`;
        }, '');
    }

    toArgs() {
        return this.importValue.filter(isSymbol).map(function toValue(item) {
            return item.valueOf();
        });
    }

    toRegExp() {
        const regexpSource = this.importValue.reduce(function(regex, value) {
            let valueRegexp;
            if (isSymbol(value)) {
                valueRegexp = '(.+)';
            } else {
                valueRegexp = toRegExpSource(value.valueOf());
            }

            if (regex === '') {
                return valueRegexp;
            }

            return `${regex}${valueRegexp}`;
        }, '');

        return new RegExp(`${regexpSource}$`);
    }
}
