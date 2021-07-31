import {getModule} from '../../public/utils/get-module';
import {IMPORTS_PREFIX} from '../constants';
import {toVar} from '../utils/to-var';


export class AddonWrapper {
    #name = null;
    #importPath = null;
    #instance = null;
    #type = null;

    constructor({name, importPath, type}) {
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
}
