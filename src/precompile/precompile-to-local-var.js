import nunjucks from 'nunjucks';

import {localVarWrapper as precompileWrapper} from './local-var-wrapper';


/**
 * @param {string}      source
 * @param {string}      fileName
 * @param {nunjucks.Environment} env
 * @returns {string} Precompiled template, assigned to given `fileName`
 */
export function precompileToLocalVar(source, fileName, env) {
    return nunjucks.precompileString(source, {
        env,
        name: fileName,
        wrapper: precompileWrapper
    });
}
