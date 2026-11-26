import type {statsCompiler} from './stats-compiler';

export type CompiledTemplate = (context?: Record<string, unknown>) => string | Promise<string>;

export type CompilerOptions = Parameters<typeof statsCompiler>[1];
