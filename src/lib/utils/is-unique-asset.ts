import {isUniqueObject} from './is-unique-object';


export const isUniqueAsset = isUniqueObject(getAssetIndex);

function getAssetIndex<T extends {toString(): string}>(list: T[], item: T) {
    return list.findIndex(function(listItem) {
        return listItem.toString() === item.toString();
    });
}
