// TypeScript Version: 2.8

/** Infer which keys of T to pick. */
export declare const inferPick: <V>() => <K extends keyof V>(
  x: Pick<V, K>
) => Pick<V, K>;
/** Remove readonly modifier from an interface. */
export declare type Mutable<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<infer T>
    ? T[]
    : T[K] extends ReadonlySet<infer T>
    ? Set<T>
    : T[K] extends ReadonlyMap<infer K, infer V>
    ? Map<K, V>
    : Mutable<T[K]>;
};
/** Remove readonly modifier on keys `K` from 'T'. */
export declare type MutableKeys<T, K extends keyof T> = Pick<
  T,
  Exclude<keyof T, K>
> &
  {
    -readonly [K in keyof T]: T[K] extends ReadonlyArray<infer T>
      ? T[]
      : T[K] extends ReadonlySet<infer T>
      ? Set<T>
      : T[K] extends ReadonlyMap<infer K, infer V>
      ? Map<K, V>
      : Mutable<T[K]>;
  };
/**
 * Make a Readonly T.
 *
 * This will infer the proper one of `Readonly`, `ReadonlyArray`,
 * `ReadonlyMap`, `ReadonlySet`, to use from T.
 */
export declare type ShallowReadonly<T> = T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Set<infer U>
  ? ReadonlySet<U>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : Readonly<T>;
/** Create a deeply readonly T. */
declare type _Readonly<T> = T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Set<infer U>
  ? DeepReadonlySet<U>
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : {
      readonly [P in keyof T]: _Readonly<T[P]>;
    };
interface DeepReadonlyArray<T> extends ReadonlyArray<_Readonly<T>> {}
interface DeepReadonlySet<T> extends ReadonlySet<_Readonly<T>> {}
interface DeepReadonlyMap<K, V>
  extends ReadonlyMap<_Readonly<K>, _Readonly<V>> {}
export { _Readonly as Readonly };
/** Create a shallow readonly T. */
export declare function shallowReadonly<T>(t: T): ShallowReadonly<T>;
/** Create a nested readonly T. */
export declare function readonly<T>(t: T): _Readonly<T>;
/**
 * Remove TypesToRemove properties from T.
 *
 * For example to remove all number and function properties:
 *
 * interface Person {
 *   name: string;
 *   age: number;
 *   formattedName(): string;
 *   isSaved: boolean
 * }
 *
 * const person: RemoveType<Person, number|Function> = {
 *   name: 'Alice',
 *   isSaved: true,
 * };
 */
export declare type RemoveType<T, TypesToRemove> = {
  [FilteredKey in {
    [PropName in keyof T]: T[PropName] extends TypesToRemove ? never : PropName;
  }[keyof T]]: T[FilteredKey];
};
/**
 * Create a new type based off of T with TypesToKeep properties.
 *
 * For example to keep all string and boolean properties:
 *
 * interface Person {
 *   name: string;
 *   age: number;
 *   formattedName(): string;
 *   isSaved: boolean
 * }
 *
 * const person: KeepType<Person, string|boolean> = {
 *   name: 'Alice',
 *   isSaved: true,
 * };
 */
export declare type KeepType<T, TypesToKeep> = {
  [FilteredKey in {
    [PropName in keyof T]: T[PropName] extends TypesToKeep ? PropName : never;
  }[keyof T]]: T[FilteredKey];
};
/**
 * Require one and only one of the properties of an object to exist.
 *
 * type DbRecord = UnsavedRecord & OneOf<{draftId: string, dbId: string}>;
 */
export declare type OneOf<T> = {
  [K in keyof T]: (Pick<T, K> &
    Partial<Record<Exclude<keyof T, K>, undefined>>);
}[keyof T];
