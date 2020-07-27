import nunjucks from 'nunjucks';

import {ERROR_MODULE_NOT_FOUND} from '../constants';
import {StaticExtension} from '../static-extension/StaticExtension';
import {getFirstExistedPath} from '../utils/get-first-existed-path';
import {getPossiblePaths} from '../utils/get-possible-paths';
import {isUnique} from '../utils/is-unique';

import {getNodesValues} from './get-nodes-values';

/**
 * Parse `Add` value to expression
 * @example
 *   'foo' + bar + 'qux'
 *
 * @param {nunjucks.nodes.Add} node
 *
 * @returns {string}
 */
function getAddNodeValue(node) {
    if (!(node instanceof nunjucks.nodes.Add)) {
        throw new TypeError('Wrong node type');
    }

    return [node.left, node.right].map(function(node) {
        if (node instanceof nunjucks.nodes.Add) {
            return getAddNodeValue(node);
        }

        if (node instanceof nunjucks.nodes.Literal) {
            return `"${node.value}"`;
        }

        if (node instanceof nunjucks.nodes.Symbol) {
            return node.value;
        }

        throw new TypeError('Unsupported node signature');
    }).join(' + ');
}

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

    return asset.value;
}

/**
 * @param {nunjucks.nodes.Root} nodes
 * @param {string|string[]}     searchAssets
 * @returns {Promise<[string, string][]>}
 */
export function getAssets(nodes, searchAssets) {
    const assets = getNodesValues(
        nodes,
        nunjucks.nodes.CallExtensionAsync,
        getNodeValue
    ).filter(isUnique);
    const possiblePaths = getPossiblePaths(assets, [].concat(searchAssets));
    const resolvedAssets = possiblePaths.map(function([path, paths]) {
        return getFirstExistedPath(paths).then(function(importPath) {
            return [path, importPath];
        }, function(error) {
            if (error.code !== ERROR_MODULE_NOT_FOUND) {
                throw new Error(`Asset "${path}" not found`);
            }

            throw error;
        })
    });

    return Promise.all(resolvedAssets);
}
