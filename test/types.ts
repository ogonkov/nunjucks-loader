import type {statsCompiler} from './stats-compiler';

export type T = (context?: Record<string, unknown>) => string | Promise<string>;

export type O = Parameters<typeof statsCompiler>[1];
