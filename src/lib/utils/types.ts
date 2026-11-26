export type ComparisonFunction<T> = (a: T, b: T) => number;
export type IndexGetter<T, L> = (list: L, item: T) => number;
export type ItemFinder<T, U> = (item: U) => T | undefined;
