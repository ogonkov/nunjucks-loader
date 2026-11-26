import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getAddNodeValue} from './get-add-node-value';


/**
 * @param {nunjucks.Node} node
 * @returns {Error|ImportWrapper}
 */
export function getTemplatePath(node) {
    if (typeof node.template.value !== 'string') {
        const templateImport = getAddNodeValue(node.template);

        return new Error(
            `Dynamic templates expressions is not yet supported. Skipping ${
                templateImport.toString()
            }.`
        );
    }

    return new ImportWrapper().addLiteral(node.template.value);
}
