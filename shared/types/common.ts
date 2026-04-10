export type NestedRecord<T = string> = { [k: string]: T | NestedRecord<T> };
