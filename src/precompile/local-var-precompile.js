import nunjucks from "nunjucks";
import {localVarWrapper as precompileWrapper} from "./local-var-wrapper";

/**
 * @param {string}      source
 * @param {string}      fileName
 * @param {Environment} env
 * @returns {Promise<string>}
 */
export function precompileToLocalVar(source, fileName, env) {
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
