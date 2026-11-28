import {Extension, parser, nodes as NunjucksNodes} from 'nunjucks';

import {getModule} from '../utils/get-module';
import {getRegexMatches} from '../utils/get-regex-matches';

import {ASSETS_KEY} from './contants';
import type {AssetMeta, StaticArguments} from './types';

function isDynamicAsset(asset: AssetMeta): asset is Extract<AssetMeta, {path: RegExp}> {
    return typeof asset.path !== 'string';
}

export class StaticExtension implements Extension {
    tags: string[];

    constructor() {
        this.tags = ['static'];
    }

    parse(parser: parser.Parser, nodes: typeof NunjucksNodes) {
        const token = parser.expect('symbol');
        const assetPath = parser.parseExpression();
        const args = new nodes.NodeList();
        args.addChild(assetPath);

        if (parser.skipSymbol('as')) {
            const alias = parser.parsePrimary();
            args.addChild(new nodes.Literal(alias.lineno, alias.colno, 'value' in alias ? alias.value : ''));
        }

        parser.advanceAfterBlockEnd(token.value);

        return new nodes.CallExtensionAsync<StaticExtension>(this, 'run', args);
    }

    run(...args: StaticArguments): void {
        const [context, url] = args;
        const exportVar = args.length === 4 ? args[2] : undefined;
        const callback = args.length === 4 ? args[3] : args[2];
        const assets = context.lookup(ASSETS_KEY);
        let asset: AssetMeta | undefined;

        for (const assetUUID in assets) {
            if (!Object.prototype.hasOwnProperty.call(assets, assetUUID)) {
                continue;
            }

            const assetMeta = assets[assetUUID];
            if (isDynamicAsset(assetMeta) && assetMeta.path.test(url)) {
                asset = assetMeta;
            } else if (assetMeta.path === url) {
                asset = assetMeta;
            }

            if (asset) {
                break;
            }
        }

        if (!asset) {
            return callback(new Error(
                `StaticExtension: cannot find module ${JSON.stringify(url)}`
            ));
        }

        if (isDynamicAsset(asset)) {
            const assetModule = getModule(asset.module);
            const args = getRegexMatches(url, asset.path);

            Promise.resolve(assetModule(...args)).then(function(assetModule) {
                const asset = getModule(assetModule);
                if (exportVar) {
                    context.setVariable(exportVar, asset);

                    return callback(null, '');
                }

                callback(null, asset);
            }, function(error) {
                callback(error);
            });

            return;
        }

        const assetModule = getModule(asset.module);
        const assetValue: unknown = typeof assetModule === 'function' ? assetModule() : assetModule;

        if (exportVar) {
            context.setVariable(exportVar, assetValue);

            return callback(null, '');
        }

        callback(null, assetValue);
    }
}
