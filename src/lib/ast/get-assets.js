import nunjucks from 'nunjucks';

import {StaticExtension} from '../../public/static-extension/StaticExtension';
import {getFirstExistedPath} from '../../utils/get-first-existed-path';
import {getPossiblePaths} from '../../utils/get-possible-paths';
import {isUniqueAsset} from '../../utils/is-unique-asset';
import {ERROR_MODULE_NOT_FOUND} from '../constants';
import {ImportWrapper} from '../import-wrapper/ImportWrapper';

import {getAddNodeValue} from './get-add-node-value';
import {getNodesValues} from './get-nodes-values';

/**
 * @param {nunjucks.nodes.Node} node
 * @param {Function}            ExtensionClass
 * @return {boolean}
 */
function isExtension(node, ExtensionClass) {
    return (
        node.extName instanceof ExtensionClass ||
        node.extName === ExtensionClass.name
    );
}

function getNodeValue(node) {
    if (!isExtension(node, StaticExtension)) {
        return;
    }

    const [asset] = node.args.children;

    if (asset instanceof nunjucks.nodes.Add) {
        return getAddNodeValue(asset);
    }

    const value = new ImportWrapper()

    if (asset instanceof nunjucks.nodes.Symbol) {
        value.addSymbol(asset.value);
    }

    if (asset instanceof nunjucks.nodes.Literal) {
        value.addLiteral(asset.value);
    }

    return value;
}

async function filterPaths([path, paths]) {
    try {
        const importPath = await getFirstExistedPath(paths);
        return [path, importPath];
    } catch (error) {
        if (error.code !== ERROR_MODULE_NOT_FOUND) {
            throw new Error(`Asset "${path}" not found`);
        }

        throw error;
    }
}

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {string|string[]}     searchAssets
 * @returns {Promise<[ImportWrapper, ImportWrapper][]>}
 */
export function getAssets(nodes, searchAssets) {
    const assets = getNodesValues(
        nodes,
        nunjucks.nodes.CallExtensionAsync,
        getNodeValue
    ).filter(isUniqueAsset);
    const possiblePaths = getPossiblePaths(assets, [].concat(searchAssets));
    const resolvedAssets = possiblePaths.map(filterPaths);

    return Promise.all(resolvedAssets);
}
