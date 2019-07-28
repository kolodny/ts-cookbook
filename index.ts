/** Infer which keys of T to pick. */
export const inferPick = <V>() => <K extends keyof V>(
  x: Pick<V, K>
): Pick<V, K> => x;

/** Remove readonly modifier from an interface. */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K] extends ReadonlyArray<infer T>
    ? T[]
    : T[K] extends ReadonlySet<infer T>
    ? Set<T>
    : T[K] extends ReadonlyMap<infer K, infer V>
    ? Map<K, V>
    : Mutable<T[K]>;
};
/** Remove readonly modifier on keys `K` from 'T'. */
export type MutableKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
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
export type ShallowReadonly<T> = T extends Array<infer U>
  ? ReadonlyArray<U>
  : T extends Set<infer U>
  ? ReadonlySet<U>
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<K, V>
  : Readonly<T>;

// https://stackoverflow.com/a/49670389
/** Create a deeply readonly T. */
type _Readonly<T> = T extends Array<infer U>
  ? DeepReadonlyArray<U>
  : T extends Set<infer U>
  ? DeepReadonlySet<U>
  : T extends Map<infer K, infer V>
  ? DeepReadonlyMap<K, V>
  : { readonly [P in keyof T]: _Readonly<T[P]> };

interface DeepReadonlyArray<T> extends ReadonlyArray<_Readonly<T>> {}
interface DeepReadonlySet<T> extends ReadonlySet<_Readonly<T>> {}
interface DeepReadonlyMap<K, V>
  extends ReadonlyMap<_Readonly<K>, _Readonly<V>> {}

export { _Readonly as Readonly };

/** Create a shallow readonly T. */
export function shallowReadonly<T>(t: T): ShallowReadonly<T> {
  return t as any;
}

/** Create a nested readonly T. */
export function readonly<T>(t: T): _Readonly<T> {
  return t as any;
}

// This looks scarier than it is. The trick to know about how this works
// is that when:
// type T = { a: 'a'; b: 'b'; c: never, d: never };
// type U = T[keyof T];`
// `U` will have type 'a'|'b', notice that the never values are filtered out.

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
export type RemoveType<T, TypesToRemove> = {
  [FilteredKey in {
    [PropName in keyof T]: T[PropName] extends TypesToRemove ? never : PropName;
  }[keyof T]]: T[FilteredKey];
};

// Here's the above with Annotations, assume T is `Person` from above and `TypeToRemove` is `string`:
// export type RemoveType<T, TypesToRemove> = {
//
////! Skip this for now and come back to this when directed.
////! Welcome back! K will be 'age', then 'formattedName', and then 'isSaved'.
//   [FilteredKey in
//     {

//////// This will be { age: 'age', formattedName: 'formattedName', isSaved: 'isSaved' }
//       [PropName in keyof T]: T[P] extends TypesToRemove ? never : PropName
//
//
//     }[keyof T] // Now it's 'age'|'formattedName'|'isSaved'
//
//   ]: T[FilteredKey] // `T` is only being used for the filtered keys.
// };

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
export type KeepType<T, TypesToKeep> = {
  [FilteredKey in {
    [PropName in keyof T]: T[PropName] extends TypesToKeep ? PropName : never;
  }[keyof T]]: T[FilteredKey];
};
