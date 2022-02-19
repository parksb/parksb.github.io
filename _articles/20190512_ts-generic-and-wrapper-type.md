---
id: 30
title: "하나의 타입에 강아지와 고양이 담기"
subtitle: "파라미터의 다형성과 제네릭"
date: "2019.5.12"
---

여기 강아지와 고양이가 있다.

```kotlin
data class Dog(val name: String)
data class Cat(val name: String)
```

`identity` 함수는 항상 파라미터를 그대로 반환하는 항등 함수다. `identity(dog: Dog)` 함수는 `Dog` 타입 인자를 받아 반환하며, `identity(cat: Cat)` 함수는 `Cat` 타입 인자를 받아 반환한다.

```kotlin
fun identity(dog: Dog) = dog
fun identity(cat: Cat) = cat
```

```kotlin
val dog = Dog("Jake")
identity(dog) // Dog("Jake")

val cat = Cat("Cake")
identity(cat) // Cat("Cake")
```

만약 `Fox` 타입에 대한 항등 함수를 사용하려 한다면 타입 에러가 발생할 것이다. `Fox` 타입을 인자로 받는 `identity` 함수를 정의하지 않았기 때문이다.

```kotlin
data class Fox(val name: String)
```

```kotlin
val fox = Fox("Nick")
identity(fox) // None of the following functions can be called with the arguments supplied:
              // public fun identity(cat: Cat): Cat defined in root package in file File.kt
              // public fun identity(dog: Dog): Dog defined in root package in file File.kt
```

새로운 타입이 추가될 때마다 인자의 타입만 다르고 똑같은 동작을 하는 `identity` 함수를 만드는 것은 효율적이지 않다. 이때 다형성(Polymorphism)으로 문제를 해결할 수 있다. 다형성은 하나의 엔티티를 여러 타입으로 사용할 수 있게 해준다. 다형성에는 다양한 종류가 있지만, 여기서는 파라미터의 다형성(Parametric polymorphism)에 대해서만 다룬다.

파라미터의 다형성은 표현식을 값이 아닌 타입으로 파라미터화(Parameterization)시킨다. 파라미터화는 함수가 파라미터를 이용해 표현식을 추상화하는 것을 말한다. 가령 `fun twice(x: Int) = x + x` 함수는 `x + x`라는 표현식을 파라미터 `x`로 파라미터화한 것이다. 이때 `42 + 42`는 `twice(42)`로 추상화된다. 함수는 파라미터를 실제 값으로 대체한다. `twice` 함수는 파라미터 `x`를 `42`라는 실제 값으로 파라미터화했다. 한편 타입으로 파라미터화를 하면 타입 파라미터를 실제 타입으로 대체하게 된다. 이를 함수와 구분하기 위해 타입 추상화(Type abstraction)라는 용어를 사용한다.[^itpl]

앞서 본 항등 함수를 타입 파라미터 `T`를 이용하여 타입으로 파라미터화하면 아래와 같이 작성할 수 있다. 객체 지향 프로그래밍에서는 이런 식의 파라미터의 다형성을 제네릭(Generic)이라고 부른다.

```kotlin
fun <T> identity(x: T) = x
```

타입 파라미터 `T`는 함수를 사용하는 시점에 실제 타입이 특정되며, `Dog`, `Cat`, `Fox` 뿐 아니라 `Int`, `String` 등 어떤 타입이든 적용할 수 있다. 더 이상 타입별로 `identity` 함수를 만들 필요가 없는 것이다.

```kotlin
val dog = Dog("Jake")
identity(dog) // Dog("Jake")

val fox = Fox("Nick")
identity(fox) // Fox("Nick")

val num = 10
identity(10) // 10
```

# References

* 조재용, 우명인, "코틀린으로 배우는 함수형 프로그래밍", 인사이트, 2019.
* [Jaemin Hong, Sukyoung Ryu, "Introduction to Programming Languages", 2021.](https://hjaem.info/itpl)

[^itpl]: Jaemin Hong, Sukyoung Ryu, "Introduction to Programming Languages", 2021, pp. 21.
