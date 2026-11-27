import type {Context} from 'nunjucks';

import type {ASSETS_KEY} from './contants';

export type AssetMeta =
    | {
        path: string;
        module: unknown;
    }
    | {
        path: RegExp;
        module: (...matches: string[]) => unknown;
    };

export interface StaticContext extends Context {
    lookup(name: typeof ASSETS_KEY): Record<string, AssetMeta>;
}

export type StaticCallback = (error: unknown, value?: unknown) => void;

export type StaticArguments =
    | [context: StaticContext, url: string, callback: StaticCallback]
    | [context: StaticContext, url: string, exportVar: string, callback: StaticCallback];
