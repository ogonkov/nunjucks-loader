import {getModule} from '../../public/utils/get-module';

const instance = Symbol('instance')

export class AddonWrapper {
    constructor({name, importPath}) {
        Object.defineProperty(this, 'name', {
            value: name,
            enumerable: true
        });

        Object.defineProperty(this, 'importPath', {
            value: importPath,
            enumerable: true
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
