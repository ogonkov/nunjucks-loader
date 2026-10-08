import nunjucks, {NodeType} from 'nunjucks';

import {StaticExtension} from '../../public/static-extension/StaticExtension';
import {ERROR_MODULE_NOT_FOUND} from '../constants';
import {ImportWrapper} from '../import-wrapper/ImportWrapper';
import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';
import {isUniqueAsset} from '../utils/is-unique-asset';

import {getAddNodeValue} from './get-add-node-value';
import {getNodesValues} from './get-nodes-values';
import {isLiteral} from './is-literal';

function isExtension(node: NodeType, ExtensionClass: Function) {
    return 'extName' in node ? (
        node.extName instanceof ExtensionClass ||
        node.extName === ExtensionClass.name
    ) : false;
}

function getNodeValue(node: nunjucks.nodes.CallExtensionAsync) {
    if (!isExtension(node, StaticExtension)) {
        return;
    }

    const [asset] = node.args.children;

    if (asset instanceof nunjucks.nodes.Add) {
        return getAddNodeValue(asset);
    }

    const value = new ImportWrapper()

    if (asset instanceof nunjucks.nodes.Symbol) {
        if (typeof asset.value !== 'string') {
            return;
        }

        value.addSymbol(asset.value);
    }

    if (isLiteral(asset)) {
        if (typeof asset.value !== 'string') {
            return;
        }

        value.addLiteral(asset.value);
    }

    return value;
}

function isModuleNotFoundError(error: unknown) {
    return error instanceof Error && 'code' in error && error.code === ERROR_MODULE_NOT_FOUND;
}

async function filterPaths([path, paths]: [ImportWrapper, ImportWrapper[]]): Promise<[ImportWrapper, ImportWrapper]> {
    try {
        const importPath = await getFirstExistedPath(paths);
        return [path, importPath];
    } catch (error) {
        if (!isModuleNotFoundError(error)) {
            throw new Error(`Asset "${path}" not found`, {cause: error});
        }

        throw error;
    }
}

export function getAssets(nodes: nunjucks.nodes.Root, searchAssets: string | string[]) {
    const assets = getNodesValues(
        nodes,
        nunjucks.nodes.CallExtensionAsync,
        getNodeValue
    ).filter(isUniqueAsset);
    const possiblePaths = getPossiblePaths(assets, ([] as string[]).concat(searchAssets));
    const resolvedAssets = possiblePaths.map(filterPaths);

    return Promise.all(resolvedAssets);
}
