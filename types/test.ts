import {
  Readonly as CookbookReadonly,
  ShallowReadonly,
  readonly,
  shallowReadonly,
  inferPick,
  Mutable,
  MutableKeys,
  RemoveType,
  KeepType,
  OneOf
} from "../";

const test = (desc: string, fn: () => void) => {
  fn();
};

const readonlyFixture = {
  a: {
    b: {
      c: 1
    }
  }
};

type ReadonlyFixture = typeof readonlyFixture;

const everyTypeFixture = {
  num1: 1,
  num2: 2,
  str1: "str1",
  str2: "str2",
  fn1: () => {},
  fn2: () => {},
  bool1: true,
  bool2: false,
  arr1: [1, 2, 3],
  arr2: ["1", "2", "3"],
  null: null,
  undefined
};

type EveryTypeFixture = typeof everyTypeFixture;

const readonlyEveryTypeFixture: Readonly<EveryTypeFixture> = everyTypeFixture;

type ReadonlyEveryTypeFixture = typeof readonlyEveryTypeFixture;

test("DeepReadonly type", () => {
  const obj: CookbookReadonly<ReadonlyFixture> = readonlyFixture;

  obj.a.b.c = 2; // $ExpectError
});

test("Readonly type", () => {
  const obj: ShallowReadonly<ReadonlyFixture> = readonlyFixture;

  obj.a = { b: { c: 3 } }; // $ExpectError
  obj.a.b.c = 4;
});

test("readonly function", () => {
  const obj = readonly(readonlyFixture);

  obj.a.b.c = 2; // $ExpectError
});

test("shallowReadonly function", () => {
  const obj = shallowReadonly(readonlyFixture);

  obj.a = { b: { c: 3 } }; // $ExpectError
  obj.a.b.c = 4;
});

test("Mutable", () => {
  const mutable: Mutable<ReadonlyEveryTypeFixture> = readonlyEveryTypeFixture;
  mutable.str1 += "test";
});

test("MutableKeys", () => {
  const mutable: MutableKeys<
    ReadonlyEveryTypeFixture,
    "str1" | "num1"
  > = readonlyEveryTypeFixture;
  mutable.str1 += "test";
  mutable.str2 += "test"; // $ExpectError
  mutable.num1++;
  mutable.num2++; // $ExpectError
});

test("Mutable with the readonly function", () => {
  const readonlyObj = readonly(everyTypeFixture);
  type Obj = typeof readonlyObj;
  // The weird casting is only needed because of the conversion of
  // `ReadonlyArray` to `Array`
  const mutableObj1 = readonlyObj as Mutable<Obj>;
  const mutableObj2: Mutable<Obj> = readonlyObj as any;
  mutableObj1.arr1.push(1);
  mutableObj2.arr1.push(1);

  // No conversion needed if there's no `Array`, `Set` or `Map`.
  const noConversionNeededObj = readonly({
    num: 1,
    str: "str",
    bool: true
  });
  type NoConversionNeededObj = typeof noConversionNeededObj;
  const mutableNormal: Mutable<NoConversionNeededObj> = noConversionNeededObj;
  mutableNormal.num++;
});

test("inferPick", () => {
  const obj = inferPick<EveryTypeFixture>()({
    fn2: () => console.log("cool"),
    arr2: ["string", "array", "inferred"],
    bool1: true
  });

  type Keys = keyof typeof obj;

  // $ExpectType: "fn2" | "bool1" | "arr2"
  const k: Keys = "bool1";

  // $ExpectType: boolean
  obj.bool1;
});

interface Person {
  name: string;
  age: number;
  isSaved: boolean;
  save: () => void;
}

test("RemoveType", () => {
  const personForTest: RemoveType<Person, boolean | (() => void)> = {
    name: "Joe",
    age: 44
  };
});

test("KeepType", () => {
  const personForTest: KeepType<Person, string | number> = {
    name: "Joe",
    age: 44
  };
});

test("Oneof", () => {
  interface UnsavedRecord {
    name: string;
    age: number;
  }

  type DbRecord = UnsavedRecord &
    OneOf<{
      draftId: string;
      dbId: string;
    }>;
  const record: DbRecord = {} as any;
  if (record.dbId) {
    record.draftId; // $ExpectType: undefined
  }
});
