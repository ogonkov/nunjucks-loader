import nunjucks from 'nunjucks';

import {getUsagesOf} from './get-usages-of';
import type {ExtensionAddon} from './types';

export function getUsedExtensions<T extends ExtensionAddon>(nodes: nunjucks.nodes.Root, instances: T[]) {
    return getUsagesOf(nunjucks.nodes.CallExtension, nodes)(
        instances, ({extName}) => (({name, instance}) => {
            // Sometime `extName` is instance of custom tag
            return name === extName || instance === extName
        })
    );
}
