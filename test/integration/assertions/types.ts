import type {TestContext} from 'node:test';

export type Test = (name: string, fn: (this: TestContext) => void | Promise<void>) => Promise<void>;

export interface BuildStats {
    children: {
        name: string;
        warnings: {message: string}[];
    }[];
}

export interface CompilerOptions {
    esModule: boolean;
}
