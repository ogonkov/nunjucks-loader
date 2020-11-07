import nunjucks from 'nunjucks';

import {localVarWrapper as precompileWrapper} from './local-var-wrapper';


/**
 * @param {string}      source
 * @param {string}      fileName
 * @param {Environment} env
 * @returns {string}
 */
export function precompileToLocalVar(source, fileName, env) {
    return nunjucks.precompileString(source, {
        env,
        name: fileName,
        wrapper: precompileWrapper
    });
}
