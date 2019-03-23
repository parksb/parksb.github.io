---
id: 2
title: "🤔 Java는 어떻게 Garbage Collection을 할까?"
subtitle: "오브젝트의 일생"
date: "2018.04.23"
tags: "자바"
---

Garbage Collection(GC)은 쉽게 말하자면 메모리에 쓸데없이 공간을 차지하고 있는 것들을 정리하는 작업이다. C에선 그런 작업을 개발자가 직접했다.

![malloc으로 메모리 할당, free로 메모리 해제.](https://t1.daumcdn.net/cfile/tistory/9941BD3A5ADF38B808)

만약 `free()`를 통해 메모리를 해제하지 않고 계속 동적할당을 수행시킨다면 메모리가 꽉 차버리고 만다. 그런데 Java 프로그래밍을 할 때는 메모리 해제 작업을 하지 않는다. 아무리 많은 객체를 만들고 지워도 메모리를 해제하는 코드는 어디에도 들어가지 않는다. 메모리 관리에 신경쓰지 않고 개발을 해도 괜찮은걸까? JVM이 GC를 지원하기 때문에 괜찮다.

# JVM Memory Structure

GC를 다루기 전에 먼저 메모리 구조를 살펴봐야 한다. 메모리는 저장하는 데이터의 종류에 따라 크게 네가지 영역으로 나뉜다.

- Stack: 지역변수, 메소드, 파라미터 등
- Heap: 동적할당된 데이터
- Data: static variables
- Code: 프로그램의 바이트 코드

data와 code에 들어간 데이터는 런타임 중엔 수정될 일이 없기 때문에 한 영역으로 취급하는 경우도 있다. 여기서 중요하게 봐야할 것은 stack과 heap이다.

![](https://t1.daumcdn.net/cfile/tistory/990D9A475ADF38C10C)

stack에는 메소드들이 쌓인다. 위 그림에서는 `do()`가 현재 실행중인 메소드다. heap에는 오브젝트들이 쌓인다. 오브젝트는 인스턴스 변수나 클래스 정보를 포함하고 있으며, 메소드의 지역 변수가 오브젝트를 가리키게 된다. 그런데 `do()`의 수행이 끝난다면?

![](https://t1.daumcdn.net/cfile/tistory/99FDE23A5ADF38C90E)

stack에서 `do()`가 pop되며 Dog1 오브젝트를 가리키는 지역 변수가 사라져버렸다. 더 이상 Dog1 오브젝트에 접근할 수 있는 방법이 없다. 이렇게 stack의 직역 변수로 레퍼런스가 이어지지 않는 오브젝트는 garbage가 된다. 이렇게 레퍼런스가 소멸해서 사용할 수 없어진 오브젝트를 메모리에서 제거하는 것이 바로 garbage collector가 하는 일이다.

# Garbage Collection Algorithms

그럼 본격적으로 GC가 작동하는 방법에 대해 알아보자. 가장 먼저 드는 생각은 그냥 메소드가 끝났을 때마다 GC를 수행하면 될 것 같다. 하지만 그렇게 하려면 collector가 계속 메모리를 모니터링해야 하고, 수시로 GC가 일어날 수 있기 때문에 프로그램의 속도를 떨어뜨리고 만다. 그래서 몇가지 효율적인 방법이 고안되었다.

# Reference Counting

이 방식은 주기적으로 GC를 수행할 때 오브젝트에 몇 개의 레퍼런스가 연결되어 있는지 체크하는 방법이다.

![](https://t1.daumcdn.net/cfile/tistory/991B8E4A5ADF38D226)

`anim` 하나가 Dog1 오브젝트를 가리키고 있으므로 Dog1의 카운터는 1이다. 이처럼 레퍼런스가 이어지면 카운터를 하나 늘리고, 레퍼런스가 끊기면 카운터를 하나 줄여서 GC를 수행할 때 카운터가 0인 것들만 지워주면 된다. 매우 직관적이고 구현이 쉬운 방법이다. 하지만 문제가 있다. 오브젝트가 서로를 가리키는 상황이 올 수 있다.

![](https://t1.daumcdn.net/cfile/tistory/99D208425ADF38DA01)

이렇게 레퍼런스가 사이클링되면 `do()`의 수행이 끝나도 Cat1이 여전히 Dog1을 가리키고 있기 때문에 카운터는 0이 되지 않는다. 물론 이 문제를 해결하기 위한 방법이 있다.

# Tracing

이름 그대로 오브젝트의 레퍼런스를 추적하는 방법이다. 처음에는 stack의 지역 변수에서 시작해 해당 변수가 가리키고 있는 오브젝트를 추적한다. 만약 오브젝트에 레퍼런스가 연결되어 있다면 오브젝트의 `marked` 값을 `true`로 설정한다.

![](https://t1.daumcdn.net/cfile/tistory/9955A9505ADF38E52F)

만약 지역 변수로부터의 레퍼런스가 끊기면 연결된 오브젝트들의 `marked` 값을 `false`로 설정한다. GC를 수행할 때는 `marked` 값이 `false`인 오브젝트들만 메모리에서 해제하면 된다.

![](https://t1.daumcdn.net/cfile/tistory/994A284A5ADF38EE0B)

괜찮아 보인다. 그런데 여기서 메모리를 해제할 때 한가지 신경써야 할 이슈가 있다.

![](https://t1.daumcdn.net/cfile/tistory/992FB2345ADF38F618)

메모리를 해제하고 나면 이렇게 빈 공간이 생기게 된다. 이런 식으로 빈 공간이 늘어나면 새로 메모리가 할당 될 때 저 틈을 비집고 들어가야 하는 상황이 발생하며, 이렇게 되면 전체 메모리 공간은 충분한데 들어갈 틈이 없어서 메모리를 할당하지 못하는 문제가 생긴다. 별로 효율적이지 않다.

![](https://t1.daumcdn.net/cfile/tistory/9997F6455ADF38FF20)

따라서 이미 할당된 메모리 공간을 한쪽으로 모아주는 compacting 작업을 해줘야 한다. 이것도 GC과정에서 수행된다. tracing과 compacting은 실제로 JVM의 garbage collector가 사용하는 방법이며, tracing은 'mark-and-sweep'이라고도 부른다. 자, 그런데 GC를 더 효율적으로 수행하는 방법이 있다.

# Generational GC

이 부분이 GC의 핵심이다. GC는 기본적으로 오버헤드가 매우 큰 작업이다. GC가 수행될 때는 JVM이 stop-the-world를 발생시킨다. stop-the-wold가 발생하면 프로그램이 모두 멈추고 GC를 수행한다. generaltional GC는 아예 처리해야 하는 작업량을 조절해 오버헤드를 줄인다. 이 방식은 통계적 관찰에서 출발했다.

> 대부분의 오브젝트는 생성 이후 금방 garbage가 된다!

그렇다! 오브젝트는 만들어진지 얼마되지 않아 금방 레퍼런스가 사라진다. 이 관찰을 활용해 GC의 효율을 높이기 위해 JVM은 heap의 영역을 세대별로 쪼개 관리한다.

![Eden, S0, S1, Tenured, Permanent 영역.](https://t1.daumcdn.net/cfile/tistory/997B293F5ADF39062D)

eden, S0, S1은 생성된지 얼마되지 않은 오브젝트들이 쌓이는 공간이기 때문에 young generation이라고 부르며, 반대로 tenured와 permanent는 old generation이라고 부른다. 순서대로 살펴보자.

- Eden: 에덴동산할 때 그 에덴이다. 오브젝트가 처음 생성됐을 때 eden에 들어간다.
- S0, S1: 생성된 이후 시간이 조금 흘렀을 때 garbage가 되지 않은 오브젝트들이 eden에서 이곳으로 옮겨진다. 살아남은 오브젝트들이 들어간다고 해서 survivor space라고 부른다.
- Tennured: 오래 살아있을 확률이 높은 오브젝트들이 들어간다. 여기서는 거의 GC가 수행되지 않기 때문에 정년보장이라고 보면 된다.
- Permanent: 프로그램이 끝날 때까지 살아있을 오브젝트들이 들어간다.

이렇게 heap을 나눠 각 영역에 대해서만 GC를 수행하면 성능을 더 높일 수 있다. 구체적인 수행 절차는 다음과 같다.

1. 오브젝트가 계속 생성되어 eden이 어느정도 차면 eden에서 GC를 수행한다. 여기서 garbage가 아닌 오브젝트들을 S0로 복사하고, eden을 비운다.
2. eden에서 몇 번 GC가 이뤄지면 S0에 살아남은 오브젝트가 쌓인다. 이렇게 S0가 가득차면 eden과 S0에서 GC를 수행해 garbage가 아닌 오브젝트들을 S1으로 복사하고 eden과 S0를 비운다.
3. 같은 방식으로 S1이 가득차면 eden과 S1에서 GC를 수행해 garbage가 아닌 오브젝트들을 S0로 복사하고 eden과 S1을 비운다. 이렇게 S0와 S1을 왔다갔다 하면서 주기적으로 GC가 수행된다.
4. 위 과정을 반복하다보면 유난히 오래 살아남는 오브젝트들이 나올 수 있다. 만약 오브젝트의 age counter가 일정 이상이라면 tenured로 보내 S0와 S1이 가득차지 않도록 만들어준다.

오브젝트가 살아남아 다음 세대로 넘어가는 것을 promote라고 표현한다. 또한 young generation에서 일어나는 GC를 minor GC라고 부르고, old generation에서 일어나는 GC를 major GC라고 부른다. minor GC는 자주, 빠르게 수행된다. 반대로 major GC는 가끔, 느리게 수행된다.

이렇게 Java의 GC에 대해서 간단히 알아봤다. 자동으로 수행되는 GC를 믿지 않고 `System.gc()` 메소드를 호출해 개발자가 강제로 GC를 수행할 수도 있는데, 절대 사용하지 말 것을 추천한다. 성능을 크게 떨어트릴 수 있으며 매우 비효율적인 방법이다. 심지어 위험할 수도 있다. 꼭 명시적으로 메모리를 해제하고 싶다면 차라리 오브젝트에 `null`을 할당해 레퍼런스를 끊는 것이 더욱 안전하다.