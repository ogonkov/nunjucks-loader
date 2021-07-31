import {isUniqueObject} from './is-unique-object';


export const isUniqueAsset = isUniqueObject(getAssetIndex);

function getAssetIndex(list, item) {
    return list.findIndex(function(listItem) {
        return listItem.toString() === item.toString();
    });
}
