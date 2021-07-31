import {getModule} from '../../public/utils/get-module';
import {IMPORTS_PREFIX} from '../constants';
import {toVar} from '../utils/to-var';

const instance = Symbol('instance')

export class AddonWrapper {
    constructor({name, importPath, type}) {
        if (typeof name !== 'string') {
            throw new TypeError('AddonWrapper: name should be a string');
        }
        Object.defineProperty(this, 'name', {
            value: name,
            enumerable: true
        });

        if (!importPath) {
            throw new TypeError('AddonWrapper: import path required');
        }
        Object.defineProperty(this, 'importPath', {
            value: importPath,
            enumerable: true
        });

        if (typeof type !== 'string') {
            throw new TypeError('AddonWrapper: addon type required');
        }
        Object.defineProperty(this, 'importVar', {
            enumerable: true,
            get() {
                return toVar(`${IMPORTS_PREFIX}_${type}_${name}`);
            }
        });

        this[instance] = null;
    }

    get instance() {
        if (this[instance] !== null) {
            return this[instance];
        }

        return new Promise((resolve, reject) => {
            import(this.importPath)
                .then((instance) => getModule(instance))
                .then((_instance) => {
                    this[instance] = _instance;
                    return _instance;
                })
                .then(resolve)
                .catch(reject);
        });
    }
}
