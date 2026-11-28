import type {NodeType} from 'nunjucks';

import type {ImportWrapper} from '../import-wrapper/ImportWrapper';

export type NodeConstructor<T extends NodeType> = new (...args: any[]) => T;

export interface NamedAddon {
    name: string;
}

export interface ExtensionAddon extends NamedAddon {
    instance: unknown;
}

export type UsageMatcher<TNode, TAddon> = (node: TNode) => (addon: TAddon) => boolean;
export type TemplateImport = [path: ImportWrapper, importPath: ImportWrapper];
export type TemplatePaths = [path: ImportWrapper, paths: ImportWrapper[]];
