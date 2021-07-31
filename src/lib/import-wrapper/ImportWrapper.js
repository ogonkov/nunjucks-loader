import {getStringBase64Hash} from '../utils/get-string-base64-hash';
import {toRegExpSource} from '../utils/to-regexp-source';
import {unquote} from '../utils/unquote';

import {ImportLiteral} from './ImportLiteral';
import {ImportSymbol} from './ImportSymbol';
import {getType} from './get-type';
import {isSymbol} from './is-symbol';
import {optimizeImportLiterals} from './optimize-import-literals';
import {throwNotSymbolOrLiteral} from './throw-not-symbol-or-literal';


function setImportValue(instance, importValue) {
    instance.importValue = importValue;
    instance._optimizedImportValue = optimizeImportLiterals(importValue);
}

/**
 * @typedef {(ImportLiteral | ImportSymbol)} ImportLiteralOrSymbol
 */

/**
 * Wrapper for manage import strings
 */
export class ImportWrapper {
    constructor(importValue = []) {
        const value = [].concat(importValue);
        throwNotSymbolOrLiteral('ImportWrapper', value);

        this.importValue = null;
        this._optimizedImportValue = null;
        setImportValue(this, value);
    }

    /**
     * @param {ImportLiteralOrSymbol[]} value
     * @returns {ImportWrapper}
     */
    push(...value) {
        throwNotSymbolOrLiteral('ImportWrapper#push', value);

        setImportValue(this, [
            ...this.importValue,
            ...value
        ]);

        return this;
    }

    /**
     * @param {...string} value
     * @returns {ImportWrapper}
     */
    addSymbol(...value) {
        return this.push(...value.map((value) => new ImportSymbol(value)));
    }

    /**
     * @param {...string} value
     * @returns {ImportWrapper}
     */
    addLiteral(...value) {
        return this.push(...value.map((value) => new ImportLiteral(value)));
    }

    /**
     * @returns {ImportLiteralOrSymbol}
     */
    shift() {
        const [item, ...importValue] = this.importValue;
        setImportValue(this, importValue);

        return item;
    }

    /**
     * @param {...ImportLiteralOrSymbol} value
     * @returns {ImportWrapper}
     */
    unshift(...value) {
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

    /**
     * @param {...ImportLiteralOrSymbol} value
     * @returns {ImportWrapper}
     */
    concat(...value) {
        return new ImportWrapper([
            ...this.importValue,
            ...value
        ]);
    }

    map(callback) {
        return new ImportWrapper(this.importValue.map(callback));
    }

    /**
     * @param {string} str
     * @returns {boolean}
     */
    startsWith(str) {
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

    /**
     * @returns {string}
     */
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

    /**
     * @returns {string}
     */
    toGlob() {
        return this.importValue.reduce(function toGlob(glob, item) {
            if (!glob) {
                return item.toGlob();
            }

            return `${glob}${item.toGlob()}`;
        }, '');
    }

    /**
     * List of all dynamic parts values
     *
     * @returns {string[]}
     */
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
