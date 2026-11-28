import type {AddonWrapper} from '../addons-wrapper/AddonWrapper';
import type {FilterWrapper} from '../addons-wrapper/FilterWrapper';
import type {ImportWrapper} from '../import-wrapper/ImportWrapper';

export type ImportPair = [path: ImportWrapper, importPath: ImportWrapper];
export type AddonOutput = Pick<AddonWrapper, 'importStatement' | 'dependencyInject'>;
export type FilterOutput = Pick<FilterWrapper, 'importStatement' | 'dependencyInject'>;

export interface DynamicImportOptions {
    esModule?: boolean;
    importVar?: string;
}

export interface DynamicMetaOptions {
    metaKey: string;
    importVar: string;
    depsKey: string;
}

export interface LoaderOutputOptions {
    templateImport: string;
    imports: string;
    defaultExport: string;
    precompiled: string;
    envOptions: string;
}

export interface TemplateImportsOptions {
    assets: ImportPair[];
    dependencies: ImportPair[];
    extensions: AddonWrapper[];
    filters: FilterWrapper[];
    globals: AddonWrapper[];
}

export type Assignments = Record<'templates' | 'globals' | 'extensions' | 'filters' | 'assets', string>;
export type ImportsAndAssignments = [imports: string, assignments: Assignments];
