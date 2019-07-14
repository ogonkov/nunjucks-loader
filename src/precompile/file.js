import nunjucks from "nunjucks";
import {wrapper as precompileWrapper} from "./wrapper";

/**
 * @param {string}      fileName
 * @param {string}      source
 * @param {Environment} env
 * @returns {Promise<string>}
 */
export function bySource(fileName, source, env) {
    return new Promise(function(resolve, reject) {
        try {
            const precompiled = nunjucks.precompileString(source, {
                env,
                name: fileName,
                wrapper: precompileWrapper
            });

            resolve(precompiled);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * @param {string} fileName
 * @param {Environment} env
 * @returns {Promise<string>}
 */
export function byPath(fileName, env) {
    return new Promise(function(resolve, reject) {
        try {
            const precompiled = nunjucks.precompile(fileName, {
                env,
                name: fileName,
                wrapper: precompileWrapper
            });

            resolve(precompiled);
        } catch (e) {
            reject(e);
        }
    });
}
