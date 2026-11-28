import type {LoaderContext} from 'webpack';

import {getModule} from '../../public/utils/get-module';
import {IMPORTS_PREFIX, TEMPLATE_DEPENDENCIES} from '../constants';
import {getModuleOutput} from '../output/get-module-output';
import {getImportStr} from '../utils/get-import-str';
import {stringifyRequest} from '../utils/stringify-request';
import {toVar} from '../utils/to-var';

import type {AddonWrapperOptions} from './types';


export class AddonWrapper<T = unknown> {
    #name: string;
    #importPath: string;
    #instance: T | null = null;
    #type: string;
    #loaderContext: LoaderContext<unknown>;
    #es = false;

    constructor({name, importPath, type, es, loaderContext}: AddonWrapperOptions) {
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

    /** Loaded addon module, or its pending import promise. */
    get instance(): T | Promise<T> {
        if (this.#instance !== null) {
            return this.#instance;
        }

        return new Promise<T>((resolve, reject) => {
            import(this.#importPath)
                .then((instance) => getModule(instance) as T)
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

    get dependencyInject(): string | Promise<string> {
        return `${TEMPLATE_DEPENDENCIES}.${this.#type}['${this.#name}'] = {
            module: ${getModuleOutput(this.importVar)}
        };`;
    }
}
