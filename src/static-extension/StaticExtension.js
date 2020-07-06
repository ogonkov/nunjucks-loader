import {ASSETS_KEY} from './contants';
import {getModule} from '../utils/get-module';
import {getRegexMatches} from '../utils/get-regex-matches';

export class StaticExtension {
    constructor() {
        this.tags = ['static'];
    }

    parse(parser, nodes) {
        const token = parser.nextToken();
        const assetPath = parser.parseExpression();
        const args = new nodes.NodeList();
        args.addChild(assetPath);

        if (parser.skipSymbol('as')) {
            const alias = parser.parseExpression();
            args.addChild(new nodes.Literal(alias.lineno, alias.colno, alias.value));
        }

        parser.advanceAfterBlockEnd(token.value);

        return new nodes.CallExtensionAsync(this, 'run', args);
    }

    run(...args) {
        const callback = args.pop();
        const [context, url, exportVar] = args;
        const assets = context.lookup(ASSETS_KEY);
        let asset;

        for (const assetUUID in assets) {
            if (!Object.prototype.hasOwnProperty.call(assets, assetUUID)) {
                continue;
            }

            const assetMeta = assets[assetUUID];
            if (typeof assetMeta.path !== 'string' && assetMeta.path.test(url)) {
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

        const assetModule = getModule(asset.module);

        if (typeof assetModule === 'function') {
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

        if (exportVar) {
            context.setVariable(exportVar, assetModule);

            return callback(null, '');
        }

        callback(null, assetModule);
    }
}
