---
id: 1
title: "ES6와 함께 JavaScript로 OOP하기"
subtitle: "자바스크립트의 OOP는 진정한 OOP가 아닌가?"
date: "2018.04.15"
---

객체지향 프로그래밍(OOP, Object-Oriented Programming)은 절차지향 프로그래밍(Procedural Programming)과 대비되는 프로그래밍 방법론이다.

절차지향 프로그래밍 방식 언어로는 대표적으로 C언어가 있다. 일반적으로 C코드는 특정 기능을 수행하는 함수들로 구성되어 있다. C 프로그래머는 프로그램의 각 기능을 구현하고, 이 기능들이 어떤 절차로 수행되는가를 중심으로 개발한다. 객체지향 프로그래밍 방식 언어는 Java가 대표적이다. Java 프로그래머는 프로그램에 필요한 각 객체들의 속성과 동작을 구현하고, 이 객체들이 어떻게 상호작용하는가를 중심으로 개발한다. 절차지향 프로그래밍은 명령을 순차적으로 수행하고, 객체지향은 그렇지 않다는 의미는 아니다. C든 Java든 기본적으로 명령은 순서대로 수행된다.

C와 Java를 예시로 들었는데, 절차지향과 객체지향은 패러다임이지 언어의 속성은 아니다. Java로도 절차지향 프로그래밍을 할 수 있고, C언어로 객체지향 프로그래밍을 할 수 있다. 다만 C언어는 문법 자체로 객체지향을 지원하지 않기 때문에 매우 비효율적이다.[^1] 반면 Java는 언어가 차체적으로 객체지향 프로그래밍을 위한 다양한 문법을 제공하고 있으며, 굳이 자바로 절차지향 프로그래밍을 할 이유는 없다.

OOP의 가장 큰 장점은 유지보수가 쉽다는 것이다. 특히 다른 사람과 함께 개발해야 할 때 발생하는 혼란을 줄여준다. 다른 사람들과 절차지향 프로그래밍 방식으로 프로젝트를 해봤다면 알겠지만, 내가 작업하는 코드에 다른 사람이 구현한 함수를 가져다 써야하는 경우가 있다. 반대로 내가 구현한 함수를 다른 사람이 가져다 쓰는 경우도 있다. 여기서 문제가 발생한다. 내가 작성한 함수를 다른 부분에도 사용하기 위해 내용을 고치면 내 함수를 쓰던 다른 사람의 코드에 문제가 생길 수 있다. 따라서 다른 사람이 작성한 코드를 매번 해석해야 하며, 내 함수가 어디서 어떻게 사용되는지 항상 신경쓰고 있어야 한다.

객체지향 프로그래밍 방식으로 개발을 한다면 이런 문제를 해결할 수 있다. 각 기능을 독립적인 모듈로 관리할 수 있으며, 다른 사람이 내 코드의 내용을 직접 수정하지 않고 데이터에 접근하게 만들 수 있다. 따라서 코드 재사용성을 높이고 의존성을 관리하기 쉬워진다. 대신 코드 설계를 잘해야 한다. 객체 사이의 관계를 생각하지 않고 무작정 코드를 작성하기 시작하면 모든 것이 꼬여버릴 수 있다.

![말을 만들고 싶다면 먼저 말 공장을 만들어야 한다.](/images/995B74355AD5C39A1C.webp)

처음 객체지향 프로그래밍 방식으로 개발을 하면 굉장히 번거롭다고 느껴진다. 특히 바로 결과물이 나오지 않고 설계도를 그려야 한다는 점이 답답하다. 말을 만들기 위해 말 공장을 먼저 만들어야 한다. 공장의 장점은 한 번 만들어두면 이후에 반복적으로 사용할 수 있고, 말에 추가적인 기능을 붙일 때도 공장에 장비를 하나 더 들여놓기만 하면 된다는 것이다. (실제로 공장에서 제품을 찍어내는 듯한 디자인 패턴인 factory pattern이 있다.) 객체지향 방식은 현실 세계를 표현하기 적합하고, 또 직관적이기도 하다. 코드와 서비스의 미래를 생각한다면 객체지향 프로그래밍이 필요하다.

자바스크립트로도 객체지향 프로그래밍을 할 수 있을까? 한때 자바스크립트로 객체지향 프로그래밍을 한다고 하면 "자바스크립트의 객체지향은 진정한 객체지향이 아니다"라고 하는 사람들이 있었다.

하지만 자바스크립트로도 객체지향 프로그래밍을 할 수 있다. 자바스크립트는 프로토타입을 기반으로 OOP의 대표적 특성인 캡슐화, 추상화, 다형성, 상속 등을 구현할 수 있다. 다음은 자바스크립트로 고양이 클래스를 만든 코드다:

```js
function Cat(name, age) {
    this.name = name;
    this.age = age;
};

Cat.prototype.makeNoise = function() {
    console.log('Meow!');
}

var cake = new Cat('Cake', 3);

cake.makeNoise(); // 'Meow!'
```

다른 객체지향 언어를 사용해 본 사람이라면 일반적인 객체지향 언어와 굉장히 다르다는 것을 알 수 있다. 객체지향하면 떠오르는 클래스없이 함수가 쓰였고, 심지어 메소드는 그 함수 밖의 프로토타입에서 정의되었다. 자바스크립트의 프로토타입 기반 객체지향 프로그래밍[^2]에 생소한 사람에게는 '이건 뭔가 잘못됐어'하는 생각이 들 수 있다.

ES6에는 클래스 기반 객체지향 프로그래밍 문법이 추가되면서 자바나 C++같은 다른 객체지향 언어들과 비슷한 방식으로, 보다 간결하게 객체지향 프로그래밍을 할 수 있게 되었다. (프로토타입 기반 OOP는 MDN의 [Object-oriented JavaScript for beginners](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_JS)를 참고하자.)

## Class

```js
// Animal.js
class Animal {

}

export default Animal;
```

클래스는 객체의 설계도다. 클래스의 내용을 바탕으로 인스턴스를 찍어낸다. 자바스크립트에서 클래스 선언은 아주 간단하다. 클래스 선언은 [호이스팅](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)되지만, `let`이나 `const` 처럼 그 값이 초기화되지는 않기 때문에 선언 전에 클래스를 사용하면 `ReferenceError` 예외를 던진다. 맨 마지막 라인 `export default Animal`은 Animal.js 파일에서 Animal 클래스를 외부로 export하기 위한 코드다. 클래스 외에도 함수나 변수 등을 export할 때도 이를 사용할 수 있다.

클래스 문법이 추가됐지만, 엄밀히 말하자면 진짜 클래스가 아니라 함수다. 즉, 자바스크립트에 새로운 객체지향 모델이 도입된 것이 아니고, 문법적으로만 클래스를 지원하게 된 것이다. 호이스팅된 함수는 선언 전에 사용할 수 있지만, 호이스팅된 클래스는 선언 전에 사용할 수 없다는 차이만 빼면 위 코드는 `function Animal() { }`과 같다.

```js
// index.js
import Animal from './Animal';

let anim = new Animal();
```

다른 파일에서 Animal 클래스에 접근하려면 우선 Animal 클래스를 import해야 한다. (앞서 `export default Animal` 라인을 작성한 이유다.) `anim` 변수를 만들고 `new` 키워드를 통해 Animal을 생성할 수 있다. 여기서 `anim`은 Animal 클래스를 가리키는 레퍼런스 변수(Reference variable)이며, 인스턴스(Instance)라고 부른다. 그리고 이것이 바로 클래스라는 설계도를 이용해 인스턴스라는 개체를 생성하는 과정이다.

## Constructor

```js
// Animal.js
class Animal {
    constructor(name) {

    }
}

export default Animal;
```

클래스는 하나의 constructor를 가질 수 있다. constructor는 `new Animal();` 명령을 통해 실행되어 인스턴스를 초기화하는 역할을 한다. 또한 constructor에는 `name`처럼 매개변수를 둘 수도 있다. 만약 constructor를 명시하지 않는다면 비어있는 default constructor가 만들어진다. 굳이 빈 constructor를 만들 필요는 없다.

## Instance variable

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }
}

export default Animal;
```

클래스의 멤버 프로퍼티는 constructor 안에 선언한다. 다른 언어에서는 이를 인스턴스 변수(Instance variable)라고 부르지만, 앞서 언급했듯 클래스는 사실 함수고, 자바스크립트에서 함수는 객체이기 때문에 `this.name`은 변수가 아닌 프로퍼티(Property)다.

```js
// index.js
import Animal from './Animal';

let anim = new Animal('Jake');
```

인스턴스를 생성할 때 매개변수를 넘겨줄 수 있다. `anim` 인스턴스의 프로퍼티 `name`의 값은 'Jake'다.

## Method

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

export default Animal;
```

메소드는 함수와 비슷하며, 메소드는 객체의 동작을 정의한다. `getName()` 메소드는 Animal 클래스의 프로퍼티인 `this.name`을 반환한다.

```js
// index.js
import Animal from './Animal';

let anim = new Animal('Jake');

console.log(anim.getName()); // 'Jake'
```

호출 역시 직관적이다.

## Static Method

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    static sleep() {
        console.log('Zzz');
    }
}

export default Animal;
```

메소드 앞에 static 키워드를 붙여주면 따로 인스턴스를 생성하지 않고 메소드를 호출할 수 있다.

```js
// index.js
import Animal from './Animal';

let anim = new Animal('Jake');

Animal.sleep(); // 'Zzz'
anim.sleep(); // Uncaught TypeError: anim.sleep is not a function
```

인스턴스를 통해 static 메소드를 호출하면 TypeError가 발생한다.

## Information Hiding

자바스크립트에는 은닉된 프로퍼티라는 개념이 없다. 자바에는 private, protected, public과 같은 접근제어자가 있어서 외부에서 인스턴스 멤버에 접근하는 것을 통제할 수 있지만, 자바스크립트는 클래스의 모든 프로퍼티가 public이다.

종종 프로퍼티 이름 앞에 언더스코어를 붙이는 방식(`this._name`)으로 private한 변수임을 표현하는 경우도 있는데, 실제로 프로퍼티가 private하게 동작하는 것은 아니기 때문에 오해를 불러일으킨다는 의견이 있다. [Airbnb JavaScript 스타일 가이드](https://github.com/ParkSB/javascript-style-guide#naming--leading-underscore)를 참고.

프로퍼티 대신 변수를 사용하면 정보를 은닉하는 효과를 낼 수 있다.

```js
// Animal.js
class Animal {
    constructor(name) {
        let name = name;

        this.getName = () => {
            return name;
        };

        this.setName = (newName) => {
            name = newName;
        }
    }
}

export default Animal;
```

변수는 해당 블록 안에만 존재하기 때문에 해당 블록을 벗어나서 접근하면 undefined가 된다. (단, 블록 스코프를 갖는 `let`, `const`와 달리 `var`는 함수 스코프를 갖는다.) 따라서 constructor 안에 변수를 선언하면 외부에서 `name`에 직접 접근할 수 없다. 더불어 `name`을 가져오는 프로퍼티와 `name`을 설정하는 프로퍼티를 두면 외부에서 `getName`과 `setName`을 통해 `name`에 간접적으로 접근할 수 있다.

## Inheritance & Polymorphism

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }
}

export default Animal;
```

상속은 OOP 개념 중 하나다. 상속은 말그대로 해당 클래스의 모든 내용을 다른 클래스에 그대로 복사한다는 의미다. 즉, Animal 클래스의 프로퍼티 `this.name`과 메소드 `getName()`을 다른 클래스에 그대로 상속할 수 있다.

```js
// Dog.js
import Animal from './Animal';

class Dog extends Animal {
    constructor(name) {
        super(name);
    }
}

export default Dog;
```

`extends` 키워드를 사용해 Dog 클래스가 Animal 클래스를 상속했다. 이제 Animal 클래스는 Dog 클래스의 superclass가 되었고, Dog 클래스는 Animal 클래스의 subclass가 되었다. Dog 클래스는 Animal 클래스가 가지고 있는 `this.name`과 `getName()`을 똑같이 갖는다.

subclass의 constructor에는 `super()`를 넣어 superclass의 constructor를 호출할 수도 있다. subclass에서 `super()`를 사용하지 않아도 되는 경우 에러가 발생하지는 않지만, 그래도 `super()`를 명시하길 권장한다.

클래스를 상속할 때는 IS-A 관계나 HAS-A 관계를 만족하는지 확인해야 한다. 가령 "사과는 과일이다(Apple is a fruit)"는 IS-A 관계를 만족하므로 Fruit 클래스가 Apple 클래스의 superclass가 될 수 있다. 한편 "차에는 바퀴가 있다(Car has a wheel)"는 HAS-A 관계를 만족하므로 Car 클래스가 Wheel 클래스의 superclass가 될 수 있다.

```js
// index.js
import Dog from './Dog';

let jake = new Dog('Jake');

console.log(jake.getName()); // 'Jake'
```

이런 식으로 사용한다. Dog 인스턴스 `jake`가 Animal 클래스의 `getName()`을 호출한다.

## Overriding

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    makeNoise() {
        console.log('It makes a noise');
    }
}

export default Animal;
```

오버라이딩(Overriding)은 subclass가 superclass의 메소드를 덮어쓰는 것을 말한다. 먼저 Animal 클래스에 `makeNoise()` 메소드를 추가했다.

```js
// Dog.js
import Animal from './Animal';

class Dog extends Animal {
    constructor(name) {
        super(name);
    }

    // Override
    makeNoise() {
        console.log('Bark!');
    }
}

export default Dog;
```

Dog 클래스에 같은 이름의 메소드 `makeNoise()`를 정의했다.

```js
// index.js
import Dog from './Dog';

let jake = new Dog('Jake');

console.log(jake.getName()); // 'Jake'
jake.makeNoise(); // 'Bark!'
```

Animal 클래스의 `makeNoise()`가 Dog 클래스의 `makeNoise()`로 오버라이드된 것을 볼 수 있다.

## Overloading

오버로딩(Overloading)은 같은 이름, 다른 매개변수를 가진 메소드가 여러 개 존재하는 것을 말한다. 매개변수가 다르면 다른 메소드임을 알 수 있기 때문에 가능한 기능인데, 자바스크립트에서는 기본적으로 불가능하다. (대신 [매개변수의 존재 여부에 따라 분기를 나누는 방식](https://stackoverflow.com/questions/456177/function-overloading-in-javascript-best-practices)으로 구현할 수는 있다.) 한 클래스 안에 같은 이름을 가진 메소드가 여러 개 존재할 수 없으며, constructor도 반드시 하나만 있어야 한다.

## Abstract

Animal 클래스가 분명 존재하지만, 단순히 '동물'을 만든다는 것은 조금 이상한 일이다. 동물은 추상적인 개념이기 때문에 Animal 객체를 생성하는 일이 있어서는 안 된다. 이럴 때 추상화(Abstraction)를 통해 `new Animal(...);`과 같은 명령을 미연에 방지할 수 있다. Java의 경우 `public abstract class Animal {...}`과 같은 방식으로 추상 클래스를 만들 수 있다. 아쉽지만 자바스크립트에서는 추상 클래스나 메소드를 만들 수 없다. 다만 추상 메소드를 직접 구현하는 방법은 있다.

```js
// Animal.js
class Animal {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    // Abstract
    makeNoise() {
        throw new Error('makeNoise() must be implement.');
    }
}

export default Animal;
```

`makeNoise()`를 추상 메소드로 만들어 subclass에서 구현되지 않은 `makeNoise()`를 호출하면 에러를 발생시키도록 했다. 이 경우 추상 메소드는 반드시 subclass에서 오버라이드되어야 한다.

추상 클래스를 만드는 것을 조금 더 번거롭다. 직접 Abstract 클래스를 만들어 상속시키는 방식인데, 스택오버플로우의 [Does ECMAScript 6 have a convention for abstract classes?](https://stackoverflow.com/questions/29480569/does-ecmascript-6-have-a-convention-for-abstract-classes)를 참고해보자.

## Interface

인터페이스(Interface)는 추상 메소드들의 집합이다. 클래스와는 다르며, 인스턴스 변수를 가질 수 없다. 자바의 경우 인터페이스는 `public interface Pet {...}`과 같이 만들고, 다른 클래스에서 `public class Dog extends Animal implements Pet`과 같은 방식으로 구현(Implement)한다. 이 코드에서 Dog 클래스는 Animal 클래스를 상속받고, Pet 인터페이스를 구현한다. 즉, Animal 클래스의 메소드, 인스턴스 변수와 Pet 인터페이스의 추상 메소드들을 가진다.

인터페이스만 보면 이를 구현하는 클래스가 어떤 동작을 하는지 직관적으로 볼 수 있고, 자바에서는 각 타입별로 새로운 메소드를 오버로딩할 필요가 없어진다. (자바에서의 인터페이스는 [점프 투 자바](https://wikidocs.net/217)를 참고.) 매우 편리한 기능이지만, 자바스크립트는 타입이 없는 덕 타이핑(Duck typing) 언어이기 때문에 인터페이스와 같은 문법이 없다. 한편 타입스크립트에는 자바와 유사한 방식으로 인터페이스를 사용할 수 있다.

[^1]: [Adam Rosenfield, "Object-orientation in C", Stack Overflow, 2009.](https://stackoverflow.com/a/415536/8463154)
[^2]: [임성묵, "자바스크립트는 왜 프롵토타입을 선택했을까", 2021.](https://medium.com/@limsungmook/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%8A%94-%EC%99%9C-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85%EC%9D%84-%EC%84%A0%ED%83%9D%ED%96%88%EC%9D%84%EA%B9%8C-997f985adb42?p=997f985adb42)
