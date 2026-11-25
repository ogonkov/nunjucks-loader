import nunjucks from 'nunjucks';

import {localVarWrapper as precompileWrapper} from './local-var-wrapper';


/**
 * @returns Precompiled template, assigned to given `fileName`
 */
export function precompileToLocalVar(source: string, fileName: string, env: nunjucks.Environment) {
    return nunjucks.precompileString(source, {
        env,
        name: fileName,
        wrapper: precompileWrapper
    });
}
