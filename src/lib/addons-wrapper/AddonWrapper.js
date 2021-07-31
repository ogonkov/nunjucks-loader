import {stringifyRequest} from 'loader-utils';

import {getModule} from '../../public/utils/get-module';
import {IMPORTS_PREFIX} from '../constants';
import {getImportStr} from '../utils/get-import-str';
import {toVar} from '../utils/to-var';


export class AddonWrapper {
    #name = null;
    #importPath = null;
    #instance = null;
    #type = null;
    #loaderContext = null;
    #es = false;

    constructor({name, importPath, type, es, loaderContext}) {
        if (typeof name !== 'string') {
            throw new TypeError('AddonWrapper: name should be a string');
        }
        this.#name = name;

        if (!importPath) {
            throw new TypeError('AddonWrapper: import path required');
        }
        this.#importPath = importPath;

        if (typeof type !== 'string') {
            throw new TypeError('AddonWrapper: addon type required');
        }
        this.#type = type;

        this.#loaderContext = loaderContext;

        if (typeof es !== 'boolean') {
            throw new TypeError('AddonWrapper: es type should be a boolean');
        }
        this.#es = es === true;
    }

    get name() {
        return this.#name;
    }

    get importPath() {
        return this.#importPath;
    }

    get instance() {
        if (this.#instance !== null) {
            return this.#instance;
        }

        return new Promise((resolve, reject) => {
            import(this.#importPath)
                .then((instance) => getModule(instance))
                .then((_instance) => {
                    this.#instance = _instance;
                    return _instance;
                })
                .then(resolve)
                .catch(reject);
        });
    }

    get importVar() {
        return toVar(`${IMPORTS_PREFIX}_${this.#type}_${this.#name}`);
    }

    get importStatement() {
        return getImportStr(
            stringifyRequest(this.#loaderContext, this.#importPath),
            this.#es
        )(this.importVar);
    }
}
