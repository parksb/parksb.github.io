---
id: 12
title: "🦕 공룡책으로 정리하는 운영체제 Ch.8"
subtitle: "Memory-Management Strategies"
date: "2018.05.04"
---

메모리에 로드된 프로세스를 효율적으로 관리하는 방법을 다루는 챕터로, 복잡한 매커니즘과 계산이 나오기 시작해 조금 어려워지는 단계다.

## Background

[Ch.1 Overview](https://parksb.github.io/article/5.html)에서 언급했듯 메모리는 현대 컴퓨터 시스템의 핵심이다. 프로세스는 독립적인 메모리 공간을 차지하며, 시스템은 프로세스가 자신의 영역 외에는 접근할 수 없도록 막아야 한다.

### Basic Hardware

CPU는 레지스터를 참조하며 메모리 공간을 보호하며, 레지스터 정보는 PCB에 담겨있다. 이때 레지스터는 base와 limit으로 나뉜다. **base는 프로세스가 메모리에서 사용할 수 있는 가장 작은 physical address**를 의미하며, **limit은 사용할 수 있는 주소의 범위**를 의미한다. 즉, 프로세스가 사용할 수 있는 가장 큰 주소는 base와 limit의 합이다. 따라서 어떤 프로세스의 base가 300040이고, limit이 120900이라면 프로세스가 접근할 수 있는 메모리 주소의 범위는 300040부터, 300040에 120900를 더한 420940까지가 된다.

### Address Binding

일반적으로 프로그램은 디스크에 binary executable 파일로 저장되어 있다. 프로그램을 실행하기 위해서는 메모리에 로드해 프로세스로 만들어야 한다. 이때 **디스크에서 메인 메모리로 로드되기를 대기하는 곳이 input queue다.** 운영체제는 input queue에서 프로세스를 선택해 메모리에 로드한다.

명령과 데이터를 메모리 주소로 binding하는 시점에 binding이 구분된다.

* Compile time: 만약 compile time에 프로세스가 메모리의 어느 위치에 들어갈지 미리 알고 있다면 absolute codel를 생성할 수 있다. 위치가 변경된다면 코드를 다시 컴파일해야 한다. MS-DOS .COM 형식 프로그램이 예시다.
* Load time: 프로세스가 메모리의 어느 위치에 들어갈지 미리 알 수 없다면 컴파일러는 relocatable code를 만들어야 한다. 이 경우 최종 바인딩은 로드의 소요 시간만큼 지연될 수 있다.
* Execution time: 프로세스가 실행 중 메모리의 한 세그먼트에서 다른 세그먼트로 이동할 수 있다면 바인딩은 runtime까지 지연되어야 한다.

### Logical Versus Physical Address Space

**CPU가 생성하는 logical address**이고, **메모리에 의해 취급되는 주소는 physical address**이다. compile-time과 load-time에서 주소를 binding할 때는 logical address와 physical address가 같게 생성되는 반면 execution-time에서는 다르게 생성된다. 이 경우 logical address를 virtual address라고 한다. **virtual address를 physical address로 대응시키는 것은 하드웨어 디바이스인 MMU(Memory-Management Unit)가 한다.**

## Swapping

메모리는 크기가 크지 않기 때문에 프로세스를 임시로 디스크에 보냈다가 다시 메모리에 로드해야 하는 상황이 생긴다. 이때 **디스크로 내보내는 것을 swap out, 메모리로 들여보내는 것을 swap in**이라고 하며, 우선 순위에 따라 어떤 프로세스를 swap in/out할지 결정한다. swap하는데 걸리는 시간의 대부분은 디스크 전송 시간이다.

## Contiguous Memory Allocation

보통 메모리는 두 개의 영역으로 나눠 관리되는데, low memory에는 커널을, high memory에는 사용자 프로세스를 담는다. 이때 contiguous memory allocation 시스템에서는 **각 프로세스들이 연속적인 메모리 공간을 차지**하게 된다. 프로세스가 자신의 범위를 넘지 못하도록 하는 것은 base register와 limit register의 역할이다.

### Memory Allocation

프로세스를 메모리에 로드할 때는 먼저 메모리 상에 프로세스를 넣을 수 있는 공간을 찾는다. 메모리을 분할하는 각 단위는 block이고, 이 중 **사용 가능한 block을 hole**이라고 한다. 이때 할당하는데 여러 방법이 있다.

* First fit: 첫 번째 hole을 할당
* Best fit: hole 중에서 가장 작은 곳을 할당
* Worst fit: 가장 큰 곳을 할당

하지만 Best fit도 그닥 효율이 좋지 않아 이런 식으로는 쓸 수 없다.

### Fragmentation

fragmentation은 메모리 공간을 사용하지 못하게 되는 것을 말한다. ([garbage collection에도 같은 문제가 생긴다.](https://parksb.github.io/article/2.html)) 여러 프로세스에 메모리를 할당하는 과정을 거치면 메모리의 모습은 대략 아래 그림과 비슷할 것이다.

```
+---+----------+----+------+---------+
|   | empty    |    |      | empty   |
+---+----------+----+------+---------+
```

각 block의 크기를 순서대로 30k, 60k, 20k, 40k, 60k라고 해보자. hole은 60k 두 곳뿐이다. 그런데 만약 70k 프로세스가 들어와야 한다면? **실제 메모리 공간은 120k가 비어있지만 어디에도 70k가 들어갈 수는 없다.** 이것을 external fragmentation이라고 한다.

**internal fragmentation은 실제 프로세스 공간보다 큰 메모리를 할당하게 되는 경우**를 말한다. 일반적으로 메모리가 시스템 효율을 위해 고정 크기의 정수 배로 할당되기 때문에 생기는 현상이다.

이런 문제는 할당된 block을 한쪽으로 몰아 큰 block을 생성하는 compaction으로 해결할 수 있다.

```
+---+----+------+--------------------+
|   |    |      | empty              |
+---+----+------+--------------------+
```

이렇게 하면 70k 프로세스도 들어갈 수 있다. 하지만 프로세스 할당은 정말 자주 일어나는 일이기 때문에 compaction처럼 오버헤드가 큰 작업을 매번 할 수는 없다. 과거에는 이 방법을 썼지만 이젠 다른 방법을 쓴다.

## Segmentation

segmentation은 하나의 프로세스를 여러 개로 나누는 것을 말한다. segment는 main, function, method, object 등의 논리적 단위로, **인간의 관점으로 프로세스를 나눈 것**이다. 각 segment의 base와 limit은 segment table에 저장된다.

## Paging

paging은 segmentation과 마찬가지로 프로세스를 여러 조각으로 나누는 것이다. 그런데 단순히 크기를 기준으로 나누기 때문에 비슷한 요소라도 메모리 공간에 연속적으로 할당되지 않는다. 컴퓨터 입장에서는 해석하기 쉽지만 사람이 직접 관리하기는 어렵다.

paging에서는 physical memory의 각 block을 frame이라고 하고, **logical memory의 각 block을 page라고 부른다.** frame을 작게 나눌수록 fragment가 적게 생기며, 실제로 external fragmentation은 거의 생기지 않는다. logical address를 physical address로 변환하는 page table이 필요하다.

### Basic Method

CPU에 의해 만들어진 주소는 page number(p)와 page offset(d) 두 부분으로 나뉜다. **page number는 page table의 index**로써 page table에 접근할 때 사용된다. page offset은 physical address를 얻을 때 쓰이며, **page table의 base address에 page offset을 더하면 physical address**를 구할 수 있다.

### Hardware Support

page table은 메모리에 저장되어 있다. PTBR(Page-Table Base Register)가 page table을 가리키고, PTLR(Page-Table Length Register)가 page table의 크기를 가지고 있다. 따라서 매번 데이터에 접근할 때마다 한 번은 데이터에, 한 번은 page table에 접근해야 한다. 물론 이는 비효율적인 일이기 때문에 캐시같은 것을 사용해 해결했다.

TLB(Translation Look-aside Buffer)는 참조했던 페이지를 담아주는 캐시 역할을 한다. TLB는 key-value pair로 데이터를 관리하는 acssociative memory이며, CPU는 page table보다 TLB을 우선적으로 참조한다.

page number가 TLB에서 발견되는 비율을 hit ratio라고 하며, effective memory-access time을 구하는데 쓸 수 있다.

$$
\text{Effecftive memory-access} = \text{Hit ratio} \times \text{Memory access time} + (1 - \text{Hit ratio}) \times (2 \times \text{Memory access time})
$$

만약 hit ratio가 80%이고, 평균 메모리 접근 시간이 100 나노초라면 다음과 같이 계산한다.

$$
\text{Effective memery-access time} = 0.8 \times 100 + 0.2 \times 200 = 120
$$

### Protection

메모리 할당이 contiguous한 경우 limit만 비교해도 메모리를 보호할 수 있었다. 하지만 paging은 contiguous하지 않기 때문에 다른 방법을 쓴다. page table의 각 항목에는 valid-invalid bit가 붙어있어 그 값이 valid라면 해당 페이지에 접근이 가능하고, invalid라면 해당 페이지가 logical address space에 속하지 않아 접근할 수 없다는 것을 의미한다.

### Shared Pages

paging의 또 다른 장점은 코드를 쉽게 공유할 수 있다는 것이다. 만약 코드가 reentrant code(또는 pure code)라면 공유가 가능하다. reentrant code는 runtime 동안 절대로 변하지 않는 코드이며, 따라서 여러 프로세스들이 동시에 같은 코드를 수행할 수 있다. 이런 식으로 공통 page를 공유하면 12개 로드해야 할 것을 6개만 로드해도 된다.

## Structure of the Page Table

paging을 직접 적용하면 page table의 크기가 커진다. 페이지 테이블을 효율적으로 구성하는 몇 가지 방법이 있다.

### Hierachial Paging

hierachical paging은 logical address space를 여러 단계의 page table로 분할하는 기법이다. two-level paging scheme이 예시인데, page table과 메모리 사이에 page table을 하나 더 둠으로써 모든 페이지를 로드해야 하는 부담을 줄일 수 있다.

### Hashed Page Tables

말그대로 hash table을 이용해 page table을 관리하는 기법. address space가 32비트보다 커지면 hierachial paging이 비효율적이기 때문에 주로 이 방법을 쓴다. virtual page number를 hashing해 page table을 참조하는 데 사용한다. hashed page table에서는 linked list를 따라가며 page number를 비교하고, 일치하면 그에 대응하는 page frame number를 얻는다. hash table은 검색에 $O(1)$ 시간이 걸려 매우 빠르지만 구현이 어렵다.

### Inverted Page Tables

지금까지 page table은 각 page마다 하나의 항목을 가졌다. inverted page table은 메모리의 frame마다 한 항목씩 할당하는데, 이렇게 하면 physical frame에 대응하는 항목만 저장하면 되기 때문에 메모리를 훨씬 적게 사용하게 된다. 다만 탐색 시간이 오래 걸리기 때문에 대부분의 메모리는 inverted page table과 hased page table을 결합하는 방식으로 구현되어있다.
