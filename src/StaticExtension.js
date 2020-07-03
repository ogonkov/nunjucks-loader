import {ASSETS_KEY} from './runtime-contants';
import {getModule} from './utils/get-module';

export function StaticExtension() {
    this.tags = ['static'];
    this.parse = function parse(parser, nodes) {
        const token = parser.nextToken();
        const args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);

        return new nodes.CallExtensionAsync(this, 'run', args);
    };
    this.run = function run(...args) {
        const callback = args.pop();
        const [context, url] = args;
        const assets = context.lookup(ASSETS_KEY);
        let asset;

        for (const assetUUID in assets) {
            if (!Object.prototype.hasOwnProperty.call(assets, assetUUID)) {
                continue;
            }

            const assetMeta = assets[assetUUID];

            if (assetMeta.path === url) {
                asset = assetMeta;

                break;
            }
        }

        if (!asset) {
            return callback(new Error(
                `StaticExtension: cannot find module ${JSON.stringify(url)}`
            ));
        }

        callback(null, getModule(asset.module));
    };
}
