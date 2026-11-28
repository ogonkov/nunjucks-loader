import nunjucks from 'nunjucks';

import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getAddNodeValue} from './get-add-node-value';


export function getDependenciesTemplates(nodes: nunjucks.nodes.Root) {
    const extendsNodes = nodes.findAll(nunjucks.nodes.Extends);
    const includeNodes = nodes.findAll(nunjucks.nodes.Include);
    const importNodes = nodes.findAll(nunjucks.nodes.Import);
    const fromImportNodes = nodes.findAll(nunjucks.nodes.FromImport);

    return [
        ...extendsNodes,
        ...includeNodes,
        ...importNodes,
        ...fromImportNodes
    ].map((node) => {
        const template = node.template;
        if (template === null) {
            throw new TypeError('Template node has no template expression');
        }
        if (!('value' in template) || typeof template.value !== 'string') {
            const templateImport = getAddNodeValue(template);

            return new Error(
                `Dynamic templates expressions is not yet supported. Skipping ${
                    templateImport.toString()
                }.`
            );
        }

        return new ImportWrapper().addLiteral(template.value);
    });
}
