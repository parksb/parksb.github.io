---
id: 2
title: "♻️ 자바는 어떻게 Garbage Collection을 할까?"
subtitle: "오브젝트의 일생"
date: "2018.04.23"
---

프로그램이 실행되는 내내 프로그램에서 사용하는 변수, 함수를 비롯한 각종 데이터들은 메모리에 할당되고, 해제되기를 반복한다. 이때 '언제, 어떤 데이터를 해제할 것인지' 정하는 것이 중요한 문제다. C로 프로그래밍할 때는 개발자가 직접 메모리의 할당, 해제 시점을 정해준다.

```c
int *ptr = (int*)malloc(sizeof(int) * 3); // 메모리 할당

for (int i = 0; i < 3; i++) {
  ptr[i] = i;
}

for (int i = 0; i < 3; i++) {
  printf("%d", ptr[i]); // 012
}

free(ptr); // 메모리 해제
```

만약 `free()`를 통해 메모리를 해제하지 않고 계속 동적할당을 수행한다면 사용할 수 있는 메모리가 꽉 차버리고 만다. 그런데 자바 프로그래밍을 할 때는 이러한 메모리 해제 작업을 직접 하지 않는다. 아무리 많은 객체를 만들고 지워도 메모리를 해제하는 코드는 어디에도 들어가지 않는다. 메모리 관리에 신경쓰지 않고 개발을 해도 괜찮은걸까? JVM이 Garbage Collection(GC)을 지원하기 때문에 괜찮다.

## Memory Structure

GC는 더 이상 메모리를 차지하고 있지 않아도 되는 데이터들을 메모리에서 정리하는 작업이다. GC를 다루기 전에 먼저 메모리 구조를 살펴봐야 한다. 메모리는 저장하는 데이터의 종류에 따라 크게 네가지 영역으로 나뉜다.

```
+---------------+ High address
|     Stack     |
+-------+-------+
|       |       |
|       v       |
|               |
|       ^       |
|       |       |
+-------+-------+
|     Heap      |
+---------------+
| Static (Data) |
+---------------+
|  Text (Code)  |
+---------------+ Low address
```

스택(Stack)에는 지역변수나 메서드가 저장되며, 힙(Heap) 영역에는 런타임에 동적 할당되는 데이터가 저장된다. 스태틱(Static)과 텍스트(Text) 영역은 프로그램에 상주하는 정적 변수, 바이트 코드를 저장한다. 런타임에 빈번하게 접근이 일어나는 부분은 스택과 힙이다.

```java
public static void main(String[] args) {
  do();
}

public void do() {
  Dog jake = new Dog();
}
```

```
| jake    |  +--------+
| do()    |  | Dog1   | jake -> Dog1
| main()  |  |        |
+---------+  +--------+
   Stack        Heap
```

메서드와 지역 변수들은 스택에 실행 순서대로 쌓인다. 가장 먼저 `main()`이 실행되어 스택에 들어간다. 이어서 `do()`가 호출되어 `main()` 위에 들어간다. 힙에는 런타임에 크기가 변하는 오브젝트들이 쌓인다. (`Object` 클래스를 상속받는 모든 데이터가 힙에 저장된다.) 위 예시에서 `do()` 메서드의 지역 변수 `jake`가 힙의 오브젝트 `Dog1`를 가리키게 된다. `do()`의 실행이 끝나면 아래와 같이 된다.

```
|         |  +--------+
|         |  | Dog1   |  ? -> Dog1
| main()  |  |        |
+---------+  +--------+
   Stack        Heap
```

메모리의 스택 영역에서 `do()`가 나가며 `Dog1` 오브젝트를 가리키는 지역 변수 `jake`가 사라져버렸다. 더 이상 `Dog1` 오브젝트에 접근할 수 있는 방법이 없다. 이렇게 스택의 지역 변수로 레퍼런스가 이어지지 않는 오브젝트는 garbage가 된다. 이렇게 레퍼런스가 소멸해서 사용할 수 없어진 오브젝트를 메모리에서 제거하는 것이 바로 garbage collector가 하는 일이다.

## Garbage Collection Algorithms

그럼 본격적으로 GC가 작동하는 방법에 대해 알아보자. 가장 먼저 드는 생각은 단순히 메서드 실행이 끝날 때마다 GC를 수행하면 될 것 같다. 하지만 그렇게 하려면 collector가 계속 메모리를 모니터링해야 하고, 수시로 GC가 일어날 수 있기 때문에 프로그램의 성능을 크게 떨어뜨리는 문제가 있다. 그래서 몇가지 효율적인 방법이 고안되었다.

### Reference Counting

레퍼런스 카운팅은 주기적으로 GC를 수행할 때 오브젝트에 몇 개의 레퍼런스가 연결되어 있는지 체크하는 방법이다.

```java
public static void main(String[] args) {
  do();
}

public void do() {
  Dog jake = new Dog();
}
```

```
| jake    |  +---------+
| do()    |  | Dog1[1] |  jake -> Dog1
| main()  |  |         |
+---------+  +---------+
   Stack         Heap
```

`do()`의 지역 변수 `jake` 하나가 `Dog1` 오브젝트를 가리키고 있으므로 `Dog1`의 카운터는 1이다. 이처럼 레퍼런스가 이어지면 카운터를 하나 늘리고, 레퍼런스가 끊기면 카운터를 하나 줄여서 GC를 수행할 때 카운터가 0인 것들만 지워주면 된다. 매우 직관적이고 구현이 쉬운 방법이다. 하지만 문제가 있다. 아래와 같이 오브젝트가 서로를 가리키는 상황이 올 수 있다.

```java
public static void main(String[] args) {
  do();
}

public void do() {
  Dog jake = new Dog();
  Cat cake = new Cat();

  jake.setFollowingCat(cake);
  cake.setFollowingDog(jake);
}

public class Dog {
  private Cat followingCat;
  public void setFollowingCat(Cat c) {
    this.followingCat = c;
  }
}

public class Cat {
  private Dog followingDog;
  public void setFollowingDog(Dog d) {
    this.followingDog = d;
  }
}
```

```
| setFollowingDog() |
| setFollowingCat() |
| cake              |
| jake              |  +------------+  jake -> Dog1
| do()              |  | Dog1[2]    |  cake -> Cat1
| main()            |  |    Cat1[2] |  Dog1 -> cake -> Cat1
+-------------------+  +------------+  Cat1 -> jake -> Dog1
        Stack               Heap
```

이렇게 `Cat1`이 `Dog1`을 참조하는 동시에 `Dog1`이 `Cat1`을 참조해 레퍼런스가 사이클링되면 `do()`의 수행이 끝나도 `Cat1`이 여전히 `Dog1`을 가리키고 있기 때문에 카운터는 0이 되지 않는다. 이 문제를 해결하기 위한 방법이 있다.

## Tracing

이름 그대로 오브젝트의 레퍼런스를 추적하는 방법이다. 처음에는 스택의 지역 변수에서 시작해 해당 변수가 가리키고 있는 오브젝트를 추적한다. 만약 오브젝트에 레퍼런스가 연결되어 있다면 해당 오브젝트의 `marked` 값을 `true`로 설정한다.

```
| setFollowingDog() |
| setFollowingCat() |
| cake              |
| jake              |  +----------------+  jake -> Dog1
| do()              |  | Dog1[true]     |  cake -> Cat1
| main()            |  |     Cat1[true] |  Dog1 -> cake -> Cat1
+-------------------+  +----------------+  Cat1 -> jake -> Dog1
        Stack                 Heap
```

만약 지역 변수로부터의 레퍼런스가 끊기면 연결된 오브젝트들의 `marked` 값을 `false`로 설정한다. GC를 수행할 때는 `marked` 값이 `false`인 오브젝트들만 메모리에서 해제하면 된다.

```
|         |  +----------------+  ? -> Dog1
|         |  | Dog1[false]    |  ? -> Cat1
| main()  |  |    Cat1[false] |  Dog1 -> cake(Cat1)
+---------+  +----------------+  Cat1 -> jake(Dog1)
   Stack            Heap
```

괜찮아 보인다. 그런데 여기서 메모리를 해제할 때 한가지 신경써야 할 이슈가 있다.

```
+---+----------+----+------+---------+
|   | empty    |    |      | empty   |
+---+----------+----+------+---------+
```

메모리를 해제하고 나면 중간에 빈 공간이 생기게 된다. 빈 공간이 늘어나면 새로 메모리가 할당 될 때 틈을 비집고 들어가야 하는 상황이 발생하며, 이렇게 되면 전체 메모리 공간은 충분한데 들어갈 틈이 없어서 메모리를 할당하지 못하는 문제가 생긴다. 효율적이지 않다.

```
+---+----+------+--------------------+
|   |    |      | empty              |
+---+----+------+--------------------+
```

따라서 이미 할당된 메모리 공간을 한쪽으로 모아주는 compacting 작업을 해줘야 한다. 이것도 GC과정에서 수행된다. tracing은 'mark-and-sweep'이라고도 부르며, mark-and-sweep과 compacting이 순서대로 수행되기 때문에 MSC(Mark, Sweep, Compact)라고 줄여부른다.

## Generational GC

JVM은 GC를 더 효율적으로 수행하기 위해 힙 메모리 구조를 보다 세밀하게 분류한다. GC는 기본적으로 오버헤드가 매우 큰 작업이다. GC가 시작될 때마다 JVM이 stop-the-world를 발생시켜 프로그램의 스레드를 모두 멈추고 앞서 설명한 MSC를 수행한다. 따라서 GC의 주기가 잦고, 규모가 클수록 오버헤트가 커진다.

JVM은 GC의 오버헤드를 줄이기 위해 generational GC를 사용한다. 이 방식은 '대부분의 오브젝트가 생성 이후 금방 garbage가 된다'는 통계적 관찰에서 출발했다. 보통 오브젝트가 만들어진지 얼마되지 않아 레퍼런스가 사라진다. 이 관찰을 활용해 GC의 효율을 높이기 위해 JVM은 heap의 영역을 세대별로 쪼개 관리한다.

```
                 |--------- Old ---------|
+------+----+----+-----------+-----------+
| Eden | S0 | S1 |  Tenured  | Permanent |
+------+----+----+-----------+-----------+
|----- Young ----|
```

eden, S0, S1은 생성된지 얼마되지 않은 오브젝트들이 쌓이는 공간이기 때문에 young generation이라고 부르며, 반대로 tenured와 permanent는 old generation이라고 부른다. 순서대로 살펴보자.

- Eden: 에덴동산할 때 그 에덴이다. 오브젝트가 처음 생성됐을 때 eden에 들어간다.
- Survivor 0, Survivor 1: 생성된 이후 시간이 조금 흘렀을 때 garbage가 되지 않은 오브젝트들이 eden에서 이곳으로 옮겨진다. 에덴에서 살아남은 오브젝트들이 들어간다고 해서 survivor space라고 부른다.
- Tenured: 오래 살아있을 확률이 높은 오브젝트들이 들어간다. 여기서는 거의 GC가 수행되지 않는다.
- Permanent: 프로그램이 끝날 때까지 살아있을 오브젝트들이 들어간다.

이렇게 힙을 나눠 각 영역에 대해서만 GC를 수행하면 성능을 더 높일 수 있다. 구체적인 수행 절차는 다음과 같다.

1. 오브젝트가 계속 생성되어 Eden이 어느정도 차면 Eden에서 GC를 수행한다. (MSC 과정이 진행된다.) 여기서 garbage가 아닌 오브젝트들을 S0로 옮기고, Eden을 비운다.
2. Eden에서 몇 번 GC가 이뤄지면 S0에 살아남은 오브젝트가 쌓인다. 이렇게 S0가 가득차면 Eden과 S0에서 GC를 수행해 garbage가 아닌 오브젝트들을 S1으로 복사하고 eden과 S0를 비운다.
3. 같은 방식으로 S1이 가득차면 Eden과 S1에서 GC를 수행해 garbage가 아닌 오브젝트들을 S0로 복사하고 Eden과 S1을 비운다. 이렇게 S0와 S1을 왔다갔다 하면서 주기적으로 GC가 수행된다.
4. 위 과정을 반복하다보면 유난히 오래 살아남는 오브젝트들이 나올 수 있다. 만약 오브젝트의 age counter가 일정 이상이라면 tenured로 보내 S0와 S1이 가득차지 않도록 만들어준다.

오브젝트가 살아남아 다음 세대로 넘어가는 것을 promotion이라고 표현한다. 또한 young generation에서 일어나는 GC를 minor GC라고 부르고, old generation에서 일어나는 GC를 major GC라고 부른다. minor GC는 자주, 빠르게 수행된다. 반대로 major GC는 가끔, 느리게 수행된다.

자동으로 수행되는 GC를 믿지 않고 `System.gc()` 메소드를 호출해 개발자가 GC를 강제할 수도 있는데, 성능을 크게 떨어뜨리는 매우 비효율적인 방법이기 때문에 절대 사용해서는 안 된다. (심지어 위험할 수도 있다.) 꼭 명시적으로 메모리를 해제하고 싶다면 차라리 오브젝트에 `null`을 할당해 레퍼런스를 끊는 것이 안전하다.

## References

* [Oracle Help Center, "HotSpot Virtual Machine Garbage Collection Tuning Guide"](https://docs.oracle.com/en/java/javase/15/gctuning/introduction-garbage-collection-tuning.html#GUID-326EB4CF-8C8C-4267-8355-21AB04F0D304).
