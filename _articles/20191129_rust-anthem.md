---
id: 35
title: "🦀 러스트의 멋짐을 모르는 당신은 불쌍해요"
subtitle: "높은 성능과 신뢰를 확보하기 위한 언어"
date: "2019.11.29"
---

내가 만나온 개발자들은 대체로 자신이 사용하는 프로그래밍 언어에 딱히 만족하지 않았는데 (극단적으로는 자바스크립트와 PHP가 있다.) 유독 러스트 개발자들은 적극적으로 러스트를 추천했다.

하지만 그냥 그런 언어가 있구나 정도로 생각하고 있었다. 그런데 러스트 2018 에디션 발표 이후 근 1년간 러스트 코드를 웹어셈블리로 컴파일할 수 있다든지, [deno](https://github.com/denoland/deno)의 코어가 러스트로 작성됐다든지하는 이야기들이 뉴스피드를 가득 채웠다. 심지어 스프린트 서울 6월 모임에서 [RustPython](https://github.com/RustPython/RustPython)의 인기를 본 뒤로는 러스트가 마치 피할 수 없는 시대의 흐름처럼 느껴졌다.

![러스트 비공식 마스코트 Ferris.](/images/68747470733a2f2f72757374616365616e2e6e65742f6173736574732f72757374616365616e2d666c61742d68617070792e737667.svg)

무엇보다 러스트 커뮤니티의 비공식 마스코트인 Ferris가 귀여워서 반은 먹고 들어간다.[^1] 러스트 사용자는 갑각류를 뜻하는 'Crustacean'에서 따와 'Rustancean'이라고 부른다. (한국에서는 '러스토랑스'가 많이 쓰이는데 더 적절한 것 같기도 하다...) 참고로 Ferris를 부를 때는 젠더 중립적인 "they/them"을 사용한다.[^2] 이것마저 멋지다.

러스트는 신생 언어인 만큼 업데이트를 거치며 크게 변화해왔다. 각종 블로그나 스택오버플로우 등, 웹상의 많은 자료들이 이젠 유효하지 않다. 그래서 시간이 지나도 아마 크게 바뀌지 않을 것 같은 문법적 특징과 러스트의 주요 컨셉인 오너십(Ownership)을 중심으로 러스트의 안전성을 강조해보려 한다.

## 급성장하는 언어

러스트는 2006년 모질라의 개발자 [그레이던 호어(Graydon Hoare)](https://twitter.com/graydon_pub)의 사이드 프로젝트에서 출발했다. 이후 모질라가 공식적으로 러스트를 후원하기 시작했고, 2015년 1.0 버전을 릴리즈했다. 모질라의 정책에 따라 러스트는 오픈소스 프로젝트로 진행된다. 코어 팀이 전체적인 방향을 리드하지만 누구나 러스트 개발에 기여할 수 있도록 하고 있으며, [RFC(Request For Comments)](https://github.com/rust-lang/rfcs) 문서와 [러스트 저장소](https://github.com/rust-lang/rust)에서 확인할 수 있다.

러스트는 공개 이후 꾸준히 높은 인기를 얻어왔다. 스택오버플로우 서베이에서 매년 사랑받는 언어 1위를 차지하고 있고, 2019년 기준 깃허브에서의 러스트 사용률은 2018년 대비 235% 증가했다.[^3] 뿐만 아니라 많은 기업들이 프로덕션에도 러스트를 적용하고 있다. 모질라의 브라우저 엔진 프로젝트 [서보](https://github.com/servo/servo)가 러스트로 작성되었고, 페이스북의 암호화폐 [리브라](https://github.com/libra/libra)의 코어도 러스트로 구현되었다. 국내에서는 [스포카](https://www.spoqa.com/)가 POS 통합 SDK에 러스트를 사용한다.[^4]

## 심플한 개발 환경

러스트를 처음 시작할 때 느낀 첫 번째 장점은 개발 환경이 단순하다는 것이었다. 먼저 러스트 툴체인 인스톨러 [rustup](https://rustup.rs/)을 다운로드한다.

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

rustup은 러스트 컴파일러인 rustc와 패키지 매니저인 카고(Cargo)를 설치한다. 러스트 개발은 빌드, 테스트, 문서화, 배포 모든 것을 카고로 커버할 수 있다. `cargo new` 명령으로 새 프로젝트를 생성한다. 프로젝트 디렉토리의 `Cargo.toml` 파일에 디펜던시를 추가하면 크레이트(Crate)라고 부르는 외부 패키지를 바로 사용할 수 있다. 또한 `cargo build` 명령으로 프로젝트를 빌드하며, `cargo run` 명령으로 컴파일, 실행할 수 있다.

```bash
$ cargo new hello_world --bin
$ cd hello_world
$ cargo build
$ cargo run
```

러스트의 표준 스타일 가이드를 따르는 포매터 [rustfmt](https://github.com/rust-lang/rustfmt), 코드 상의 실수와 개선점을 제안해주는 린터 [clippy](https://github.com/rust-lang/rust-clippy)와 같은 도구도 rustup을 이용하면 쉽게 툴체인에 추가해 사용할 수 있다. 기본적인 컴포넌트들은 미리 설치해두는 것이 좋다.

```bash
$ rustup update
$ rustup component add rustfmt clippy rls rust-analysis rust-src
```

랭귀지 서버가 있기 때문에 어떤 도구를 쓰든 높은 수준의 심볼 탐색, 포매팅, 자동완성 등의 개발환경을 보장 받을 수 있다. IntelliJ, VSCode 등 IDE를 사용한다면 플러그인을 설치해 개발을 할 수 있으며, [Rust Playground](https://play.rust-lang.org/)에서 러스트를 설치하지 않고 코드를 실행해볼 수도 있다.

## 안전한 문법

자바스크립트나 파이썬과 같은 언어에 비하면 러스트의 문법은 굉장히 엄격하다. 간단한 예시를 보자.

```rust
fn main() {
    let x: i8 = 10;
    let y: i8 = 20;

    println!("{}", x + y); // "30"
}
```

러스트 프로그램의 엔트리 포인트는 `main` 함수다. 변수는 `let` 키워드로 선언할 수 있으며, 이렇게 선언된 변수는 기본적으로 불변(Immutable)하여 값을 변경할 수 없다. 가변적인(Mutable) 변수를 선언하려면 `mut` 키워드를 명시해야 한다.

```rust
fn main() {
    let mut x: i8 = 10;
    x = x + 20; // 30

    println!("{}", x); // "30"
}
```

`const` 키워드로 상수를 선언할 수도 있다. 불변 변수와 다르게 상수는 상수 표현식으로만 초기화할 수 있으며, 함수의 결과 등 런타임에 계산되는 값으로 초기화 할 수 없다.

코드를 보면 알 수 있지만, 러스트는 정적 타입 언어다. 선언 시에 값을 할당하지 않는 경우 타입을 명시해야 한다. `i8`, `i32`는 8비트, 32비트 정수 타입을 의미한다. `f32`는 32비트 부동소수점 타입, `bool`은 불리언 타입을 뜻한다. 그 외 튜플(`let x: (i32, f64) = (10, 3.14)`)과 배열(`let x = [1, 2, 3]`)도 지원한다.

러스트에서 구문(Statement)은 특정 동작을 수행하지만 값을 반환하지 않는 명령을 말한다. 한편 표현식(Expression)은 결과값을 반환하는 명령을 말한다. 구문 블록의 값은 블록 내의 마지막 표현식으로 결정된다. 기본적으로 함수 정의도 하나의 구문이기 때문에 마지막 표현식이 함수의 반환값이 된다.

```rust
fn square(x: i32) -> i32 {
    x * x
}
```

변수 선언도 구문이다. 따라서 우변에 표현식을 넣을 수 있다:

```rust
let x = 1;
let y = {
    let x = 2;
    x + 1
};
```

`x + 1` 뒤에 세미콜론이 붙지 않은 이유는 이것이 표현식이기 때문이다. 세미콜론을 붙이면 구문이 된다. 같은 원리로 아래와 같은 문법도 허용된다:

```rust
let y = if x == 1 {
        10
    } else if x > 1 {
        20
    } else {
        30
    };
```

자바스크립트로 같은 표현을 하려면 가변 변수를 선언해야 한다. 아니면 중첩 삼항 조건 연산자를 사용해야 하는데, 권장되는 패턴은 아니다.

```javascript
let y = 0;
if (x === 1) {
  y = 10;
} else if (x > 1) {
  y = 20;
} else {
  y = 30
}
```

타 언어의 `switch`와 비슷한 `match`라는 컨트롤 플로우 연산자를 사용할 수도 있다.

```rust
match x {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    _ => (),
}
```

러스트 컴파일러는 문법이 조금이라도 잘못되면 에러를 낸다. 이러한 엄격함이 러스트의 러닝 커브를 높이기도 하지만, 동시에 흑마법을 쓰고 싶은 프로그래머의 폭주를 막는 역할도 한다. 또한 러스트에 익숙하지 않은 사람도 컴파일러 말을 잘 듣다보면 기본은 되어 있는 코드를 작성할 수 있도록 만들어준다. 다행히 러스트 컴파일러는 아주 친절하기 때문에 컴파일에 실패하면 어느 부분이 왜 잘못됐고, 어떻게 고쳐야하는지 알려주니까 겁먹을 필요는 없다.

## 안전한 Nullable

대부분의 언어에서 null값을 non-null값으로 사용하려 할 때 문제가 발생한다. 러스트에는 null이 없다. 대신 표준 라이브러리가 제공하는 `Option` 열거형의 멤버로 `None`과 `Some`이 있다.

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option` 타입은 어떤 값이 존재하지 않을 수 있는 상황에 대응하기 위해 사용한다. `Option`의 멤버인 `None`은 값이 존재하지 않음을 의미한다. 반대로 `Some`은 값이 존재하는 경우의 `T` 타입 값을 의미한다. `Option`은 `match`를 이용해 다룰 수 있다. nullable한 값을 사용하기 위해 `Option` 타입을 받는 함수 `plus_one`이 있다:

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let one: Option<i32> = Some(1);
let two = plus_one(one); // Some(2)
let none = plus_one(None); // None
```

`Option<i32>` 타입 파라미터 `x`가 존재하지 않으면 그대로 `None`을 반환하고, 값이 존재하면 1을 더한 값을 반환한다. `match`로 `Option` 타입을 비교할 때는 반드시 `Some`과 `None`에 대한 처리를 모두 해야한다. 또한 `Option<T>` 타입을 `T` 타입과 연산하려면 `Option<T>`를 `T`로 변환하는 과정을 거쳐야 한다. 이렇게 하면 `T` 타입과 연산하는 대상이 존재한다는 사실을 보장 할 수 있다. 변수에 단순히 null을 할당해 사용하는 것보다 훨씬 안전하다.

## 안전한 메모리 관리

러스트는 오너십이라는 방식으로 메모리를 관리한다. C에서는 `malloc`이나 `free`같은 함수를 이용해 프로그래머가 직접 메모리를 할당, 해제한다. 자바에서는 가비지 컬렉터(Garbage collector)가 돌며 메모리를 정리한다. ([Java는 어떻게 Garbage Collection을 할까? ](https://parksb.github.io/article/2.html)) 개발자가 직접 메모리를 관리하면 실수할 위험이 너무 크고, 가비지 컬렉터를 이용하면 프로그램 성능이 저하된다. 이런 점에서 오너십이라는 새로운 방식의 메모리 관리 방식은 혁신적이다.

오너십은 말그대로 값에 대한 변수의 소유권에 관한 것이며, 오너십에는 세 가지 원칙이 있다:

* 각 값은 오너(Owner)라고 불리는 변수를 갖는다.
* 한 번에 하나의 오너만 가질 수 있다.
* 오너가 스코프를 벗어나면 값이 버려진다.

### Copy

```rust
let x = 5;
let y = x; // `y` is 5, and `x` is still valid
```

위 코드는 정수 `5`를 변수 `x`에 바인딩(Binding)한 뒤, `x` 값의 복사본을 `y`에 바인딩한다. 두 값은 모두 `5`다. 값을 '복사'했기 때문이다. 정수, 불리언 등 스택 메모리를 사용하는 대부분의 원시 타입 값은 복사된다. 이처럼 스택 메모리 데이터는 크기가 고정되어 있기 때문에 값을 복사할 수 있지만, 힙 메모리를 사용하는 타입은 그렇지 않다.

### Move

```rust
let s1 = String::from("hello");
let s2 = s1; // `s2` is "hello", and `s1` is no longer valid
```

`s1`에 `String::from("hello")`를 할당했다. `let s = "hello"`처럼 문자열 리터럴(String literal)을 할당하는 것과는 다르다. 문자열 리터럴은 프로그램에 하드코딩되며, 문자열을 자르거나 이어 붙이는 등의 변경을 할 수 없다. 반면 `String` 타입은 힙 메모리에 할당되기 때문에 런타임에 문자열을 수정할 수 있다.

이어서 `s2`에 `s1`을 할당했다. `s2`가 "hello"인 것은 자명하다. 그런데 이제 `s1`은 유효하지 않다. 오너십이 '이동'했기 때문이다. `String` 타입은 메모리 포인터(ptr), 길이(len), 용량(capacity) 세 정보를 스택 메모리에 담는다. 처음에 `s1`의 포인터는 힙 메모리에 있는 데이터 "hello"의 0번 인덱스를 가리켰다.

```rust
let s1 = String::from("hello");

println!("{:?}", s1.as_ptr()); // "0x56397fd89a40"

+----------+---+        +---+---+
| ptr      | ---------->| 0 | h |
+----------+---+        +---+---+
| len      | 5 |        | 1 | e |
+----------+---+        +---+---+
| capacity | 5 |        | 2 | l |
+----------+---+        +---+---+
       s1               | 3 | l |
                        +---+---+
                        | 4 | o |
                        +---+---+
```

또 다른 변수 `s2`를 만들어 `s2`에 `s1`을 할당하면 스택의 `s1` 데이터가 복사된다. 이때 힙에 있는 데이터는 복사되지 않는다. 단지 `s1`과 같은 포인터를 가진 `s2`가 만들어진다.

```rust
let s1 = String::from("hello");
let s2 = s1;

+----------+---+         +---+---+
| ptr      | -------+--->| 0 | h |
+----------+---+    |    +---+---+
| len      | 5 |    |    | 1 | e |
+----------+---+    |    +---+---+
| capacity | 5 |    |    | 2 | l |
+----------+---+    |    +---+---+
       s1           |    | 3 | l |
                    |    +---+---+
+----------+---+    |    | 4 | o |
| ptr      | -------+    +---+---+
+----------+---+
| len      | 5 |
+----------+---+
| capacity | 5 |
+----------+---+
       s2
```

합당한 동작같지만 여기엔 함정이 있다. 러스트는 변수가 스코프를 벗어났을 때 자동으로 `drop` 메소드를 호출해 힙 메모리를 정리한다. 그런데 위와 같이 `s1`과 `s2`가 같은 힙 메모리 주소를 가리키면 `s1`이 스코프를 벗어났을 때 메모리가 한 번 해제되고, 그 뒤에 `s2`가 스코프를 벗어날 때 같은 메모리 공간를 다시 해제하게 된다. 메모리를 두 번 해제하면 메모리 변형(Corruption)을 일으킬 수 있으며, 이는 보안 취약점으로 이어진다.

그래서 러스트는 할당된 스택 메모리를 복사할 때 기존에 할당한 변수 `s1`을 무효화한다. 따라서 `s2` 변수만이 힙 메모리 데이터 "hello"를 가리킨다.

```rust
let s1 = String::from("hello");
let s2 = s1;

println!("{:?}", s1.as_ptr()); // error[E0382]: borrow of moved value: `s1`
println!("{:?}", s2.as_ptr()); // "0x56397fd89a40"

                         +---+---+
                    +--->| 0 | h |
                    |    +---+---+
                    |    | 1 | e |
                    |    +---+---+
                    |    | 2 | l |
                    |    +---+---+
                    |    | 3 | l |
                    |    +---+---+
+----------+---+    |    | 4 | o |
| ptr      | -------+    +---+---+
+----------+---+
| len      | 5 |
+----------+---+
| capacity | 5 |
+----------+---+
       s2
```

이제 `s2`가 스코프를 벗어날 때 한 번만 메모리를 해제하면 된다. 이를 `s1`의 오너십이 `s2`로 이동했다고 말한다. 힙 메모리를 사용하는 `String` 타입이나 `Vec` 타입 등 비원시 타입들은 오너십이 이동한다. 이런 타입들에 대해 깊은 복사를 하고 싶다면 `clone` 메소드를 사용해야 한다.

함수 인자로 값을 넘길 때도 마찬가지로 오너십이 이동한다:

```rust
let s = String::from("hello");
takes_ownership(s);
// `s` is no longer valid here
```

변수 `s`가 `takes_ownership` 함수의 인자로 넘어가면서 오너십도 이동한다. 따라서 값을 넘긴 이후에는 `s`를 사용할 수 없다. 반대로 함수에서 값을 반환할 때도 오너십이 이동한다.

### References & Borrowing

함수의 인자로 값을 넘기되, 오너십을 이동시키고 싶지 않을 때는 값의 참조(Reference)만 넘겨주면 된다. 이를 빌림(Borrowing)이라고 한다.

```rust
fn main() {
    let s1 = String::from("hello");
    let len = get_length(&s1);
    println!("{}: {}", s1, len); // "hello: 5"
}

fn get_length(s2: &String) -> usize {
    s2.len()
}
```

이렇게 하면 `get_length` 내에서 `s2`의 포인터가 `s1`을 가리키고, `s1`은 힙 메모리의 "hello" 데이터를 가리키게 된다. 함수가 참조만 받았기 때문에 함수 호출 이후에도 `s1`은 유효하다.

```rust
fn main() {
    let s1 = String::from("hello");
    let len = get_length(&s1);
    println!("{:?}", s1.as_ptr()); // "0x5581762b0a40"
}

fn get_length(s2: &String) -> usize {
    println!("{:?}", s2.as_ptr()); // "0x5581762b0a40"
    s2.len()
}

+----------+---+        +----------+---+        +---+---+
| ptr      | ---------->| ptr      | ---------->| 0 | h |
+----------+---+        +----------+---+        +---+---+
       s2               | len      | 5 |        | 1 | e |
                        +----------+---+        +---+---+
                        | capacity | 5 |        | 2 | l |
                        +----------+---+        +---+---+
                               s1               | 3 | l |
                                                +---+---+
                                                | 4 | o |
                                                +---+---+
```

만약 참조를 이용해 값을 바꾸고 싶다면 가변 참조(Mutable reference)를 빌려야 한다:

```rust
fn main() {
    let mut hello = String::from("hello");
    change(&mut hello);
    println!("{}", hello); // "hello, world"
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

`&mut` 키워드를 이용해 가변 참조를 넘기면 `change` 함수 안에서 인자로 받은 값을 변경할 수 있다. 이를 가변 빌림(Mutable borrowing)이라고 한다. `change` 함수에서 가변 참조로 받은 문자열 `s` 뒤에 ", world" 문자열을 덧붙여 반환했는데, 겉으로 보면 힙 메모리의 "hello" 데이터 뒤에 문자열을 그대로 붙인 것 같다. 하지만 이미 할당한 메모리 공간을 마음대로 늘릴 수 없기 때문에 실제로는 힙 메모리에 새로운 데이터를 만들고 포인터가 가리키는 메모리 주소를 바꿔 값을 재할당해야 한다.

```rust
let mut s = String::from("hello");
println!("{:?}", s.as_ptr()); // "0x55765a598a40"

s.push_str(", world");
println!("{:?}", s.as_ptr()); // "0x55765a598ba0"

                                          0   1   2   3   4
+----------+----+        +----------------+---+---+---+---+---+
| ptr      |  -------+   | 0x55765a598a40 | h | e | l | l | o |
+----------+----+    |   +----------------+---+---+---+---+---+
| len      | 12 |    |
+----------+----+    |                    0   1   2   3   4   5   6   7   8
| capacity | 12 |    |   +----------------+---+---+---+---+---+---+---+---+---+
+----------+----+    +-->| 0x55765a598ba0 | h | e | l | l | o | , |   | w | o | ...
        s                +----------------+---+---+---+---+---+---+---+---+---+
```

그런데 값을 추가할 때마다 매번 힙 메모리에 새로운 데이터를 만들면 성능에 문제가 생기기 때문에 러스트는 미래를 대비해 처음부터 메모리 공간을 조금 크게 잡아 둔다.[^5]

```rust
let mut s = String::from("hello");
println!("{:?}", s.as_ptr()); // "0x55765a598a40"

s.push_str(", world");
println!("{:?}", s.as_ptr()); // "0x55765a598a40"

                                          0   1   2   3   4         10  11  12  13
+----------+----+        +----------------+---+---+---+---+---+     +---+---+---+---+
| ptr      |  ---------->| 0x55765a598a40 | h | e | l | l | o | ... | l | d |   |   | ...
+----------+----+        +----------------+---+---+---+---+---+     +---+---+---+---+
| len      | 12 |
+----------+----+
| capacity | 26 |
+----------+----+
        s
```

`capacity`가 26이기 때문에 그보다 적은 개수의 문자를 추가할 때는 포인터가 가리키는 힙 메모리 주소나 `capacity`의 값이 변하지 않는다. 즉, 재할당이 필요하지 않다.

가변 참조를 빌려줄 때 주의할 점은 한 스코프 안에서 가변 참조는 한 번만 전달할 수 있다는 것이다.

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;

r1.push_str(", world"); // error[E0499]: cannot borrow `s` as mutable more than once at a time
```

`r1`에 가변 참조를 빌려준 다음, 바로 `r2`에 가변 참조를 빌려줬기 때문에 `r2`가 아닌 `r1`을 이용해 값을 변경하려 하면 오류가 발생한다. 러스트 컴파일러가 에러의 이유와 위치를 친절하게 알려주기 때문에 쉽게 고칠 수 있다.

```
error[E0499]: cannot borrow `s` as mutable more than once at a time
 --> src/main.rs:5:14
  |
4 |     let r1 = &mut s;
  |              ------ first mutable borrow occurs here
5 |     let r2 = &mut s;
  |              ^^^^^^ second mutable borrow occurs here
6 |
7 |     r1.push_str(", world");
  |     -- first borrow later used here
```

이런 제약을 만듦으로써 러스트는 컴파일 타임에 경쟁 상태(Race condition)를 방지할 수 있다. 경쟁 상태는 (1)두 개 이상의 포인터가 동시에 같은 데이터에 접근하며 (2)최소 하나의 포인터가 데이터 변경을 시도하고 (3)데이터를 동기화하는 메커니즘이 없는 경우에 충족된다. 데이터 경쟁은 예상치 못한 문제를 일으키며, 런타임에 알아내기도 힘들다.

오너십 모델의 최대 장점이라면 컴파일 타임에 메모리 오류를 잡을 수 있다는 것이라고 생각한다. 다른 프로그래밍 언어를 사용할 때는 잘못된 메모리 공간을 참조해서 런타임 중에 세그먼트 폴트가 일어나고 프로그램이 죽는 일이 허다했다. 하지만 러스트에선 일단 컴파일만 잘 되면 런타임에 프로그램이 예상치 못하게 죽는 일이 거의 없으며, 코드 레벨에서 안전을 보장하기 때문에 런타임 오버헤드 역시 없다. 뿐만 아니라 동시성 프로그래밍에서 일어나는 많은 이슈를 피할 수도 있다.

## 안전을 위한 에러 핸들링

`panic!` 매크로는 에러 메시지를 출력하고 프로그램의 스택을 되돌린 뒤 종료시킨다. 이를 이용하면 프로그램을 중단해야 할 정도로 심각한 문제가 예상될 때 의도적으로 에러를 일으킬 수 있다.

```rust
panic!("crash and burn"); // thread 'main' panicked at 'crash and burn'
```

하지만 모든 에러가 프로그램을 중단해야 할 정도로 심각한 것은 아니다. 그런 에러를 유연하게 처리하기 위해 러스트는 `Result` 열거형을 제공한다.

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

함수의 결과를 `Result`로 반환하면 함수의 호출처에서는 `match`를 이용해 예외 처리를 해줄 수 있다.

```rust
let file = File::open("data");
let file = match file {
    Ok(f) => f,
    Err(error) => panic!("Failed to open the file: {:?}", error)
};
```

`data` 파일을 여는 `open` 메소드가 잘 동작했으면 오픈한 파일을 그대로 `file`에 할당하고, 문제가 있으면 `panic!` 매크로를 통해 에러를 일으킨다. 에러의 종류에 따라 중첩해서 분기할 수도 있다. 아래 코드는 파일 열기를 시도했을 때 해당 파일이 없으면 파일을 생성하며, 그 외에는 에러를 일으킨다.

```rust
let file = File::open("data");
let file = match file {
      Ok(f) => f,
      Err(error) => match error.kind() {
          ErrorKind::NotFound => match File::create("data") {
              Ok(fc) => fc,
              Err(e) => panic!("Failed to create file: {:?}", e),
          },
          other_error => panic!("Failed to open file: {:?}", other_error),
      },
  };

```

`Result` 타입은 좀 더 간단한 에러 핸들링을 위해 `unwrap` 메소드를 제공한다.

```rust
let file = File::open("data").unwrap();
```

`unwrap` 메소드는 `Result`가 `Ok`면 `Ok`의 값을 그대로 반환하고, `Err`이면 `panic!` 매크로를 호출해 에러를 일으킨다. `unwrap`과 비슷하지만 에러 메시지를 직접 설정할 수 있는 `expect` 메소드도 있다.

```rust
let file = File::open("data").expect("Failed to open the data file");
```

`unwrap`을 남용하는 것보다는 `expect`를 이용해 에러 메시지를 구체적으로 설정하는 것이 좋다. 함수 안에서 함수의 호출처로 에러를 전파할 수도 있다. 간단히 `?`를 붙여주면 된다.

```rust
fn open_file() -> Result<File, io::Error> {
    let file = File::open("data")?;
    // do stuff with `file`
    Ok(file)
}
```

위 코드는 `open`의 `Result`가 `Ok`면 `Ok`의 값을 그대로 반환 뒤 다음 내용을 계속 진행한다. 반대로 `Err`이면 `Err`을 반환하고 함수를 빠져 나온다. `?` 연산자는 에러가 발생했을 때 함수의 결과로 `Err`을 반환하기 때문에 반드시 `Result` 타입을 반환하는 함수에서만 사용할 수 있다는 점에 주의해야 한다.

## No Silver Bullet

사실 어떤 기술을 찬양하는 경우는 그 기술에 대한 이해가 부족하거나, 완벽히 마스터했거나 둘 중 하나다. 나는 전자에 가깝기 때문에 장점만 알고 있다. 단점을 알기 위해서는 더 많은 사용 경험이 필요하다. 이것도 토이 프로젝트에 적용한 경험과 프로덕션에 적용한 경험 사이에 큰 차이가 있는 것이 사실이다.

현재로써 러스트의 가장 큰 단점은 신생 언어이다 보니 자료가 많지 않고, 그나마 있는 것도 지금은 유효하지 않은 정보라는 점이다. 심지어 [동명의 게임](https://store.steampowered.com/app/252490/Rust/)이 있어서 "rust lang" 또는 "러스트 언어"로 검색하지 않는 이상 검색도 잘 안 된다. 이런 상황과 동시에 언어 자체도 러닝커브가 있는 편이다. 사람의 실수를 언어 차원에서 방지하기 위해 다양한 제약 사항이 있고, 오너십 등 러스트의 핵심 개념이 생소하게 다가오기 때문이기도 하다.

러스트는 비슷한 목표를 가진 Go 언어와 자주 비교되곤 한다. Go는 단순한 문법과 Go 루틴을 이용한 가벼운 동시성 프로그래밍이 장점이다. Go를 설계한 롭 파이크(Rob Pike)가 "갓 졸업해서 훌륭한 언어를 이해할 능력이 없는 어린 구글 직원들을 위해 단순하게 만들었다"[^6]라는 발언을 해서 논란이 되기도 했는데, 표현의 적절성과 별개로 학습과 구현이 쉽고 생산성이 높은 것은 큰 장점이다. 특히 러스트의 단점이 러닝 커브이기 때문에 Go의 쉬운 문법이 더욱 부각된다. 언어 스펙만 보면 러스트가 훨씬 안전하고 다양한 기능을 지원하는 것 같지만, 현실의 모든 상황에서 꼭 하나가 우위를 차지할 수는 없을테니 상황에 맞춰서 판단하면 되겠다.

내가 러스트를 선택한 가장 큰 이유는 언어 차원의 안전성과 더불어 생태계 때문이기도 하다. 러스트는 초기부터 카고를 통한 패키지 관리를 지원한 덕분에 튼튼한 라이브러리 생태계를 가지고 있다. 러스트 생태계와 방대한 웹 생태계 사이 교집합이 있기 때문에 미래도 밝다. 러스트 프로그램을 웹어셈블리로 컴파일하면 npm에 패키지를 배포할 수 있고, 이렇게 배포한 패키지를 자바스크립트 어플리케이션에서 그대로 설치해서 사용할 수 있다.[^7] 웹어셈블리 뿐만 아니라 FFI(Foreign Function Interface)를 통해 C/C++, 파이썬 등 다른 언어로 작성된 외부 함수를 러스트로 가져와 사용하거나 러스트로 작성한 함수를 다른 언어에서 사용하도록 할 수 있다. 기술적인 생태계 뿐 아니라 [커뮤니티](https://users.rust-lang.org/)도 굉장히 활발하고 친절하다.

이런 흐름이라면 'C/C++ 대체'라는 러스트의 큰 그림이 정말 이뤄질 수도 있을 것 같다.

## References

* Andrew Gallant, "[Error Handling in Rust](https://blog.burntsushi.net/rust-error-handling/)", Andrew Gallant's Blog, 2015.
* Steve Klabnik, Carol Nichols, "[The Rust Programming Language](https://doc.rust-lang.org/book/)", 2019.
* Szmozsánszky István, "[Diving into Rust for the first time](https://hacks.mozilla.org/2015/05/diving-into-rust-for-the-first-time/)", Mozilla Hacks, 2015.
* The Rust Programming Language, "[자주 묻는 질문들](https://prev.rust-lang.org/faq.html)", 2018.
* Thomas Countz, "[Ownership in Rust, Part 2](https://medium.com/@thomascountz/ownership-in-rust-part-2-c3e1da89956e)", 2018.

[^1]: Karen Rustad Tölva, "[Hello, crustaceans](https://rustacean.net/)", rustacean.net.
[^2]: American Psychological Association, "[Singular 'They'](https://apastyle.apa.org/style-grammar-guidelines/grammar/singular-they)", apastyle.apa.org.
[^3]: GitHub, "[The State of the Octoverse](https://octoverse.github.com/#top-languages)", 2019.
[^4]: The Rust Programming Language, "[Production users](https://www.rust-lang.org/production/users)", rust-lang.org.
[^5]: Rustdoc, "[Struct Vec - Capacity and reallocation](https://doc.rust-lang.org/std/vec/struct.Vec.html#capacity-and-reallocation)", doc.rust-lang.org.
[^6]: Rob Pike, "[From Parallel to Concurrent](https://youtu.be/iTrP_EmGNmw)", 2014.
[^7]: MDN web docs "[Compiling from Rust to WebAssembly](https://developer.mozilla.org/docs/WebAssembly/Rust_to_wasm)", 2019.
