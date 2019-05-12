---
id: 30
title: "하나의 함수로 강아지와 고양이 분류하기"
subtitle: "타입스크립트 제네릭"
date: "2019.5.12"
tags: "TypeScript, OOP"
---

여기 강아지와 고양이가 있다.

```ts
class Dog {
  name: string;
  age: number;
}

class Cat {
  name: string;
  color: string;
}

const dogs: Dog[] = [...];
const cats: Cat[] = [...];
```

이때 5살 미만의 강아지나 검은색 고양이를 골라내려고 한다. `getFilteredAnimals` 함수는 파라미터 `animals`의 요소 타입이 `Dog`일 때 5살 미만의 강아지들을, `Cat`일 때 검은색 고양이들을 반환한다.

```ts
function getFilteredAnimals(animals: Dog[] | Cat[]) {
  // do something

  if (animals[0] instanceof Dog) {
    return animals.filter((dog: Dog) => dog.age < 5);
  }
 
  return animals.filter((cat: Cat) => cat.color === 'black');
}
```

반환 타입과 분류 기준이 경우에 따라 다르기 때문에 좋은 함수는 아닐 수 있다. 하지만 각각의 타입에 대해 동일한 로직을 수행해야 할 때 같은 내용의 함수를 여러개 만드는 것보다 하나의 함수로 여러 타입을 처리하는 것이 나을 때가 있다. 다만 위와 같은 방식으로는 불가능하다.

`animals`의 요소가 `Dog` 타입일 수도, `Cat` 타입일 수도 있기 때문에 함부로 `age` 프로퍼티나 `color` 프로퍼티에 접근할 수 없다. 따라서 `animals.filter(...)` 구문에서 타입 에러가 발생한다.

```
Cannot invoke an expression whose type lacks a call signature. Type '{ <S extends Dog>(callbackfn: (value: Dog, index: number, array: Dog[]) => value is S, thisArg?: any): S[]; (callbackfn: (value: Dog, index: number, array: Dog[]) => any, thisArg?: any): Dog[]; } | { ...; }' has no compatible call signatures.
```

`animals`의 타입을 `Dog[] | Cat[]`가 아닌 `Array<Dog | Cat>`으로 지정하여 해결할 수 있다.

```ts
function getFilteredAnimals(animals: Array<Dog | Cat>) {
  // do something

  if (animals[0] instanceof Dog) {
    return animals.filter((dog: Dog) => dog.age < 5);
  }
 
  return animals.filter((cat: Cat) => cat.color === 'black');
}
```

`Array`는 타입스크립트에 내장된 인터페이스로, 자바스크립트의 `Array` 객체에 엄격한 타입을 지정한 것이다. 그 원형의 일부를 살펴보면 아래와 같다:

```ts
interface Array<T> {
  pop(): T | undefined;
  push(...items: T[]): number;
}
```

여기서 `<T>`가 제네릭(Generic) 문법이다. 통상적으로 배열 자료구조는 어떤 타입이든 모두 담을 수 있어야 한다. 만약 `Array`가 `number` 타입만 담을 수 있다면 범용성이 떨어질 것이다.

```ts
interface Array {
  pop(): number | undefined;
  push(...items: number[]): number;
}
```

`any` 타입을 지정하면 어떨까? 타입 구분은 없어지겠지만 배열의 요소가 어떤 타입인지 특정할 수 없을 것이다.

```js
arr.push(1); // [1]
arr.push('str'); // [1, 'str'] 
arr.push({ name: 'jake' }); // [1, 'str', { name: 'jake' }]
```

제네릭을 사용하면 범용성을 확보하는 동시에 요소의 타입도 보장할 수 있다. 제네릭 타입 `<T>`는 임의의 타입을 받을 수 있다. (제네릭 타입의 이름은 관습적으로 `T`라고 짓는다.)

```ts
const numArr = new Array<number>();
numArr.push(1);
numArr.push('str'); // Argument of type '"str"' is not assignable to parameter of type 'number'.

const strArr = new Array<string>();
strArr.push('str');
strArr.push(1); // Argument of type '1' is not assignable to parameter of type 'string'.
```

제네릭을 설명하기 위해 `new Array()` 구문으로 배열을 선언했는데, 불가피한 상황이 아니라면 배열 리터럴(`const arr = []`)을 사용하는 쪽이 더 안전하다. Array 객체가 예상치 못하게 오버라이드될 수 있기 때문이다. 사실 제네릭 타입 배열 `Array<Dog | Cat>`도 `(Dog | Cat)[]` 처럼 고쳐쓸 수 있다.

제네릭은 인터페이스 뿐 아니라 함수나 클래스에도 적용할 수 있다. `getFilteredAnimals`의 경우 타입 각각의 프로퍼티에 접근해야 하기 때문에 제네릭을 적용하기 어려우니 조금 다른 함수를 보자.

```ts
function popToPets<T>(animals: T[]) {
  pets.push(animals.pop());
}

popToPets<Dog>(dogs);
popToPets<Cat>(cats);
popToPets<Fox>(foxes);
```

`popToPets`는 `animals`의 마지막 요소를 pets 배열로 옮긴다. `pop`은 배열의 프로토타입에 속한 프로퍼티이기 때문에 배열이라면 어떤 타입이든 `pop`에 접근할 수 있다. 따라서 `popToPets` 함수는 `Dog[]`, `Cat[]`, `Fox[]` 등 다양한 타입을 받아 처리하는 것이 가능하다.