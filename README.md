TS Cookbook
===

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Downloads][downloads-image]][downloads-url]

This library is intended to serve as a cookbook to all manner of type based operations you would need in typescript.

## Runtime performance

This library contains some type definitions as well as some helper functions. The type definitions have no runtime performance since they are compiled out. The helper function may incur an infinitesimal amount of runtime performance but will also be compiled out in any production build.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  <!-- *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->

  - [How do I...](#how-do-i)
    - [Make all properties on an interface optional](#make-all-properties-on-an-interface-optional)
    - [Make all properties on an interface required](#make-all-properties-on-an-interface-required)
    - [Make all properties on an interface nullable](#make-all-properties-on-an-interface-nullable)
    - [Make all properties on an interface readonly](#make-all-properties-on-an-interface-readonly)
    - [Create a tuple from a known set of elements](#create-a-tuple-from-a-known-set-of-elements)
    - [Create a new type with some keys of another type](#create-a-new-type-with-some-keys-of-another-type)
    - [Remove properties from an interface](#remove-properties-from-an-interface)
    - [Get the Array type, Promise type, Observable type, ...etc from something](#get-the-array-type-promise-type-observable-type-etc-from-something)
    - [Make a readonly object mutable](#make-a-readonly-object-mutable)
    - [Make some readonly keys on an object be mutable](#make-some-readonly-keys-on-an-object-be-mutable)
    - [Create a sub interface explicitly using only some keys of the interface:](#create-a-sub-interface-explicitly-using-only-some-keys-of-the-interface)
    - [Create a sub interface infering which keys of the interface to use:](#create-a-sub-interface-infering-which-keys-of-the-interface-to-use)
    - [Create a deep readonly object](#create-a-deep-readonly-object)
    - [Remove some types from an interface](#remove-some-types-from-an-interface)
    - [Create a new interface using some types of another interface](#create-a-new-interface-using-some-types-of-another-interface)
- [Advanced Mapped Types Crash Course](#advanced-mapped-types-crash-course)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How do I...

### Make all properties on an interface optional

Use the [`Partial`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
interface Person {
  name: string;
  age: number;
}
type PersonWithAllPropertiesOptional = Partial<Person>;

const person1: PersonWithAllPropertiesOptional = {}; // OK

// OK
const person2: PersonWithAllPropertiesOptional = {
  name: 'Me',
};

// OK
const person3: PersonWithAllPropertiesOptional = {
  name: 'Me',
  age: 123,
};

const person4: PersonWithAllPropertiesOptional = {
  name: 'Me',
  age: 123,
  // Error: Object literal may only specify known properties, and 'foo' does not exist in type 'Partial<Person>'.
  foo: 'bar',
};
```
</details>

### Make all properties on an interface required
Use the [`Required`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
interface Person {
  name: string;
  age?: number;
}

const person: Person = { name: 'Alex' };

// Error: Property 'age' is optional in type 'Person' but required in type 'Required<Person>'.
const requiredPerson: Required<Person> = person;
```
</details>

### Make all properties on an interface nullable
Use the [`Nullable`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };

interface Person {
  name: string;
  age: number;
}

// OK
const person: Nullable<Person> = {
  name: null,
  age: null,
};

// OK
person.name = 'Adam';
```
</details>

### Make all properties on an interface readonly
Use the [`Readonly`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
interface Person {
  name: string;
  age?: number;
}

const person: Readonly<Person> = { name: 'Alex' };

// Error: Cannot assign to 'name' because it is a constant or a read-only property.
person.name = 'Bob';
```

</details>

### Create a tuple from a known set of elements

Use the `tuple` function of [`toopl`](https://www.npmjs.com/package/toopl).

<details>

<!-- Use the `typescript` tag instead of `ts` since this test requires Typescript 3.0 -->
```typescript
import { tuple } from 'toopl';

// Type: [number, string, boolean]
const myTuple = tuple(1, '2', true);
```

</details>

### Create a new type with some keys of another type

Use the [`Pick`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
interface Person {
  name: string;
  age: number;
  id: number;
}

const personForTest: Pick<Person, 'name'|'age'> = {
  name: 'Charlie',
  age: 123,
};
```

</details>

### Remove properties from an interface

Use the `OmitStrict` type from [`type-zoo`](https://github.com/pelotom/type-zoo#omitstrictt-k-extends-keyof-t).

<details>

```ts
import { OmitStrict } from 'type-zoo';

interface Person {
  name: string;
  age: number;
  id: number;
}

const person: OmitStrict<Person, 'age'|'id'> = { name: 'Danny' };
```

Note: `Omit` from `type-zoo` would also work but wouldn't check if the property actually exists on the interface.

</details>

### Get the Array type, Promise type, Observable type, ...etc from something

Use the `infer` keyword.

<details>

<!-- Use the `typescript` tag instead of `ts` since this fails ATM https://github.com/Microsoft/dtslint/issues/189 -->
```typescript
type ArrayUnpacker<T> = T extends Array<infer U> ? U : never;
const stringArray = ['this', 'is', 'cool'];
// Type: string
let unpackedStringArray: ArrayUnpacker<typeof stringArray>;

type PromiseUnpacker<T> = T extends Promise<infer U> ? U : never;
const stringPromise = Promise.resolve('test');
// Type: string
let unpackedStringPromise: PromiseUnpacker<typeof stringPromise>;

class Box<T> {
  constructor(private readonly value: T) {}
}
type BoxUnpacker<T> = T extends Box<infer U> ? U : never;
const myBox = new Box('a string box!');
// Type: string
let myUnpackedBox: BoxUnpacker<typeof myBox>;
```

</details>

### Make a readonly object mutable

Use the `Mutable` type from [`ts-cookbook`].

<details>

```ts
import { Mutable } from 'ts-cookbook';

interface ImmutablePerson {
  readonly name: string;
  readonly age: number;
}

const immutablePerson: ImmutablePerson = {
  name: 'Danny',
  age: 50,
};

// Error: Cannot assign to 'age' because it is a read-only property.
immutablePerson.age = 51;

const person: Mutable<ImmutablePerson> = {
  name: 'Eric',
  age: 34,
};

// OK
person.age = 35;
```

</details>

### Make some readonly keys on an object be mutable

Use the `MutableKeys` type from `ts-cookbook`.

<details>

```ts
import { MutableKeys } from 'ts-cookbook';

interface ImmutablePerson {
  readonly name: string;
  readonly age: number;
  readonly isPremium: boolean;
}

const immutablePerson: ImmutablePerson = {
  name: 'Danny',
  age: 50,
  isPremium: false,
};

// Error: Cannot assign to 'age' because it is a read-only property.
immutablePerson.age = 51;

const person: MutableKeys<ImmutablePerson, 'age'|'isPremium'> = {
  name: 'Eric',
  age: 34,
  isPremium: false,
};

// OK
person.age = 35;
person.isPremium = true;

// Error: Cannot assign to 'name' because it is a read-only property.
immutablePerson.name = 'Erik';
```

</details>

### Create a sub interface explicitly using only some keys of the interface:

Use the Use the [`Pick`](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) type.

<details>

```ts
interface Person {
  name: string;
  age: number;
  id: string;
}

type PersonWithNameAndAge = Pick<Person, 'name'|'age'>;

const person: PersonWithNameAndAge = { name: 'Greg', age: 23 };
```

</details>

### Create a sub interface infering which keys of the interface to use:

Use the `inferPick` function of `ts-cookbook`.

<details>

```ts
import { inferPick } from 'ts-cookbook';

interface Person {
  name: string;
  age: number;
  id: string;
}

const person = inferPick<Person>()({ name: 'Greg', age: 23 });
```

</details>

### Create a deep readonly object

Use the `Readonly` type or `readonly` function from `ts-cookbook`. Note: for shallow objects you can use the built in Typescript `Readonly` type. If you want to ensure that it will work if the object is a `Map`, `Set`, or `Array`, use the `ShallowReadonly` type (or `shallowReadonly` function) from `ts-cookbook`.

<details>

```ts
import { Readonly, readonly, shallowReadonly } from 'ts-cookbook';

const array = readonly([1, 2, 3]);

// Error: Property 'push' does not exist on type 'ReadonlyArray<number>'.
array.push(4);

class Person {
  constructor(public name: string, public age: number) {}
}

// `person` is Readonly<Person>
const person = readonly(new Person('Harry', 42));

// Error: Cannot assign to 'name' because it is a read-only property
person.name = 'Harr';

const person2: Readonly<Person> = new Person('Kevin', 43);

// Error: Cannot assign to 'name' because it is a read-only property
person.name += '!';

// `map` is a ReadonlyMap<string, string>
const map = readonly(new Map([['foo', 'bar']]));

// Error: Property 'set' does not exist on type 'ReadonlyMap<string, string>'.
map.set('baz', 'bork');

// `myObj` is Readonly<{cool: string}>
const myObj = readonly({ cool: 'thing' });

// Note: `readonly` creates a deep readonly object, as opposed to the native
//   Typescript `Readonly` type which only creates a shallow readonly
//   object. You can still get the inferred readonly behavior in a shallow
//   fashion by using the `shallowReadonly` function from `ts-cookbook`.

const myObj2 = readonly({
  o: {
    prop: 1,
  },
  map: new Map([['foo', 'bar']]),
  a: [1, 2, 3],
});

// Error: Cannot assign to 'prop' because it is a read-only property.
myObj2.o.prop = 2;

// Error: Property 'set' does not exist on type 'DeepReadonlyMap<string, string>'.
myObj2.map.set('boo', 'zaf');

// Error: Property 'push' does not exist on type 'DeepReadonlyArray<number>'.
myObj2.a.push(4);
```

</details>

### Remove some types from an interface

Use the `RemoveType` function from `ts-cookbook`.

<details>

```ts
import { RemoveType } from 'ts-cookbook';

interface Person {
  name: string;
  age: number;
  isSaved: boolean;
  save: () => void;
}

const personForTest: RemoveType<Person, boolean|Function> = {
  name: 'Joe',
  age: 44,
};
```

</details>

### Create a new interface using some types of another interface

Use the `KeepType` function from `ts-cookbook`.

<details>

```ts
import { KeepType } from 'ts-cookbook';

interface Person {
  name: string;
  age: number;
  isSaved: boolean;
  save: () => void;
}

const personForTest: KeepType<Person, string|number> = {
  name: 'Joe',
  age: 44,
};
```

</details>

---

# Advanced Mapped Types Crash Course

The mapped syntax type is somewhat cryptic, here's the general idea of how it breaks down.

First we have a simple key type:

```ts
// This is a simple object type
type MyObject = { ['myCoolKey']: string };

let obj: MyObject = { myCoolKey: 'test' };
obj.myCoolKey; // OK
```

Typescript allows use of a union type (eg `'foo'|'bar'`) with the `in` keyword:

```ts
type MyObject = { [K in ('foo'|'bar')]: string };

let obj: MyObject = { foo: 'foo', bar: 'BAR' };
obj.foo; // OK
obj.bar; // OK
```

Another way of getting a union type is by using the `keyof` keyword:

```ts
interface Point { x: number; y: number; }
type PointKeys = keyof Point; // same as `type PointKeys = 'x'|'y'`
```

Using that knowledge, we can create a mapped type as follows:

```ts
interface Person {
  name: string;
  age: number;
}

// Create a readonly person by adding the readonly modifier to the key.
type ReadonlyPerson = { readonly [K in keyof Person]: Person[K] };
```

The type doesn't need to be tied to an existing type (like `Person` in the example above) but can be generic as well:

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

See the [official Typescript handbook](https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types) for more details.

[npm-image]: https://img.shields.io/npm/v/ts-cookbook.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ts-cookbook
[travis-image]: https://img.shields.io/travis/kolodny/ts-cookbook.svg?style=flat-square
[travis-url]: https://travis-ci.org/kolodny/ts-cookbook
[downloads-image]: http://img.shields.io/npm/dm/ts-cookbook.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/ts-cookbook
