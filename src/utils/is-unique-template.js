import {isUniqueObject} from './is-unique-object';


export const isUniqueTemplate = isUniqueObject(getTemplateIndex);

function getTemplateIndex(list, templateDescriptor) {
    const [templateImport, templatePath] = templateDescriptor;
    return list.findIndex(function compareImports([itemImport, itemPath]) {
        return (
            itemImport.toString() === templateImport.toString() &&
            itemPath.toString() === templatePath.toString()
        );
    });
}
