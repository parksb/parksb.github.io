---
id: 25
title: "🤖 컴퓨터가 코드를 읽는 아주 구체적인 원리"
subtitle: "MIPS 어셈블리어 훑어보기"
date: "2018.10.16"
---

지난 학기 [운영체제](https://parksb.github.io/article/5.html) 공부를 하면서 더 낮은 레벨은 어떻게 동작하는지 궁금해졌다. David A. Patterson과 John L. Hennessy의 Computer Organization and Design 5th Edition의 전반부를 바탕으로 MIPS instruction set에 대해 정리했다.

## Computer Abstractions and Technology

컴퓨터 아키텍처를 공부한다는 것은 **컴퓨터를 구성하는 하드웨어와 명령어가 어떻게 함께 동작하는지 알아보는 것**이다. 하드웨어를 다루기는 하지만 회로에 대한 부분을 자세히 다루지는 않는다. 회로는 로우레벨 아키텍처이고, 앞으로 다룰 내용은 회로(하드웨어)와 운영체제(소프트웨어) 사이에 있는 ISA(Instruction Set Architecture), microarchitecture와 같은 하이레벨 아키텍처다.

### Instructions: Language of the Computer

**ISA는 `add`, `load`와 같은 명령의 집합**으로, 하드웨어와 소프트웨어 사이의 인터페이스를 정의한다. **microarchitecture는 ISA의 구현체**로, 프로세서와 입출력 subsystem의 조직이다. 파이프라인의 깊이나 캐시 사이즈가 microarchitecture라고 할 수 있다.

머신 설계에는 두 가지 중요한 원칙이 있다. 첫째는 컴퓨터는 모든 것을 bit로 이해하기 때문에 **instruction과 데이터를 구분하지 못한다**는 것이고, 둘째는 **프로그램도 데이터와 똑같이 메모리에 저장된다**는 것이다. 메모리를 여러 구획으로 구분한 것은 인간의 입장이지, 컴퓨터는 결국 바이너리로 받아들인다.

### From a High-Level Language to the Language of Hardware

```c
int main(int argc, char *argv[]) {
  int s0 = 0, s1 = 1, s2 = 2;
  s0 = s1 + s2;
  return 0;
}
```

**하이레벨 언어**는 자연어와 가장 가까운 프로그래밍 언어다. 높은 생산성을 제공하며, C, C++, Java 등 흔히 사용되는 프로그래밍 언어들은 대부분 하이레벨 언어다. 하이레벨 언어는 컴파일러를 통해 어셈블리어로 변환된다.

```mips
  .data
  .text
main:
  add $s0, $s1, $s2
```

**어셈블리어**는 컴퓨터의 구체적인 동작을 텍스트로 표현한 것으로, instruction의 집합이라고 할 수 있다. 이 단계에서 하이레벨 코드는 명령줄 사이의 점프 수준까지 내려간다. 어셈블리어는 어셈블러에 의해 기계어로 변환된다.

```binary
00000000000000000000000000000100
00000000000000000000000000000000
00000010001100101000000000100000
```

**기계어**는 컴퓨터가 이해할 수 있는 바이너리 숫자만으로 구성되어 있다. 컴퓨터는 메모리에 올라간 바이너리 코드를 CPU로 가져와 instruction을 수행한다.


### Operations of the Computer Hardware

여러 종류의 ISA가 있다. 대표적으로 Intel과 AMD에서 만든 x86, AMD64가 있는데, 이들의 CPU 아키텍처는 CISC(Complex Instruction Set Computer) 구조이기 때문에 굉장히 복잡하다. 한편 RISC(Reduced Instruction Set Computer) 구조는 보다 간소하다. RISC 구조인 ARM 아키텍처는 스마트폰이나 태블릿과 같은 모바일 기기에 사용되고 있으며, 2020년에 출시된 M1 맥북도 ARM을 기반으로한 CPU를 사용한다. 우리가 사용할 MIPS(Microprocessor without Interlocked Pipeline Stages)도 RISC 구조 아키텍처다. MIPS는 명령어 세트가 깔끔해 컴퓨터 아키텍처를 공부하는 목적으로 적합하며, 실제로는 블루레이 기기나 플레이스테이션과 같은 디지털 홈, 네트워킹 장비에 사용되었다.

## MIPS Instructions

앞서 하이레벨 언어가 어셈블리어로, 어셈블리어가 최종적으로 기계어로 변환된다는 것을 보았다. 하이레벨 언어는 알고 있다는 가정하에, 실제 MIPS에서 instruction이 어떻게 작성되는지, 그 instruction이 어떤 규칙에 따라 기계어로 변환되는 지 알아보자.

먼저 CPU가 매번 메인메모리에서 값을 읽어오는 것은 오버헤드가 큰 일이기 때문에 CPU는 **레지스터라는 작고 빠른 메모리**를 가지고 있다. 크기는 작지만 속도가 빨라서 레지스터에 데이터를 두면 instruction을 빠르게 수행할 수 있다. MIPS의 연산은 32x32bit 레지스터를 사용하며, **32bit 데이터를 word라고 부른다.** 레지스터의 일부에는 미리 이름을 붙여 놓았는데, `$t0`부터 `$t9`까지는 임시 레지스터(temporary register)를 의미하며, `$s0`부터 `$s7`까지는 계속 사용되는 레지스터(saved register)를 의미한다.

#### Arithmetic Operations

산술 연산은 그리 복잡하지 않다.

```c
a = (b + c) - (d + e);
```

`a`, `b`, `c`, `d`, `e`가 각각 레지스터 `$s0`, `$s1`, `$s2`, `$s3`, `$s4`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
add $t0, $s1, $s2 # $t0 = $s1 + $s2
add $t1, $s3, $s4 # $t1 = $s3 + $s3
sub $s0, $t0, $t1 # $s0 = $t0 - $t1
```

`add`는 값을 덧셈을, `sub`는 뺄셈을 수행한다.

#### Memory Operations

MIPS의 메모리 연산은 메모리에서 레지스터로, 레지스터에서 메모리로 데이터를 옮기는 일을 한다.

```c
a = b + A[8]
```

`a`, `b`은 각각 `$s1`, `$s2`에 대응되고, `A`의 **base address**가 `$s3`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
lw $t0, 32($s3) # $t0 = $s3[8]
add $s1, $s2, $t0 # $s1 = $s2 + $t0
```

`lw`는 메모리에서 레지스터로 값을 가져온다. 정수 배열의 원소들은 메모리상에 각자 1word(4bytes)씩 차지하며 저장된다. 즉, `A[8]`는 메모리 상에 다음과 같이 존재한다.

```
4byte   4byte     4byte          4byte
A[0],   A[1],     A[2],    ...,  A[8]
$s3,    4($s3),   8($s3),  ...,  32($s3)
```

따라 `32($s3)`은 base address `$s3`에서 32bytes 떨어진 위치에 접근한다는 의미가 된다. 이때 앞에 붙는 숫자를 **offset**이라고 하며, base address를 가리키는 레지스터(위 경우 `$s3`)는 **base register**라고 한다.

```c
A[12] = a + A[8]
```

`a`가 `$s2`, A의 base address가 `$s3`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
lw $t0, 32($s3) # $t0 = $s3[8]
add $t0, $s2, $t0 # $t0 = $s2 + $t0
sw $t0, 48($s3) # A[12] = $t0
```

`sw`는 레지스터에서 메모리로 데이터를 옮긴다. 위에서는 `lw`로 메모리에서 `32($s3)` 값을 가져와 레지스터의 `$t0`에 저장했고, 아래에서는 `$t0`의 값을 메모리의 `48($s3)` 위치에 저장했다.

#### Immediate Instructions

상수를 더할 때는 `addi`를 사용한다.

```mips
addi $s3, $s3, 4 # $s3 = $s3 + 4
addi $s2, $s2, -1 # $s2 = $s2 + (-1)
```

상수에 대한 뺄셈 연산은 따로 없기 때문에 음수를 더해주면 된다.

#### Constant

MIPS 레지스터 `$zero`는 상수 0을 의미한다.

```mips
add $t0, $s1, $zero # $t0 = $s1 + 0
```

위 처럼 다른 레지스터로 값을 그대로 대입할 때 사용할 수 있다.

#### Conditional Statement

```c
if (i == j) {
  a = b + c;
} else {
  a = b - c;
}
```

`a`, `b`, `c`, `i`, `j`가 각각 `$s0`부터 `$s4`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
  bne $s3, $s4, Else # if ($s3 == $s4)
  add $s0, $s1, $s2 # { $s0 = $s1 + $s2 }
  j Exit
Else:
  sub $s0, $s1, $s2 # else { $s0 = $s1 - $s2 }
Exit:
  ...
```

`bne`는 두 레지스터 값이 같은지 비교해 같다면 다음 구문을, 다르다면 지정된 라벨로 점프한다. 위에서는 `bne`를 통해 `$s3`와 `$s4`가 같은지 비교한 뒤, 다르다면 `Else` 라벨로 점프해 `sub $s0, $s1, $s2`를 실행하도록 했다. 라벨 이름은 개발자가 임의로 정할 수 있다. 꼭 `Else`나 `Exit`라는 이름일 필요는 없다는 것이다. 또한 라벨의 위치는 어셈블러가 계산한다.

#### Loop

```c
while (save[i] == k) {
  i += 1;
}
```

`i`, `k`가 각각 `$s3`, `$s5`에, `save`의 base address가 `$s6`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
Loop:
  sll $t1, $s3, 2 # $t1 = $s3 << 2
  add $t1, $t1, $s6 # $t1 = $t1($s6)
  lw $t0, 0($t1) # $t0 = 0($t1)
  bne $t0, $s5, Exit # if ($t0 != $s5) { goto Exit }
  addi $s3, $s3, 1 # $s3 += 1
  j Loop
Exit:
  ...
```

상당히 복잡한데, 크게 두 부분으로 나눌 수 있다. `bne`부터 `j` 라인까지는 루프의 조건을 확인하고 `i` 값을 증가시키는 부분이다. 그 위의 `sll`부터 `lw` 라인까지는 레지스터에 `save[i]` 값을 가져오는 부분이다.

`sll` 자체는 control flow에 중요한 instruction이 아니고, 단순히 값을 left shift하는 기능을 한다. `$s3`의 값을 2만큼 left shift하면 4를 곱하는 것과 같다. 이는 `$s3` 값이 1증가할 때마다 4를 곱함으로써 `$s6`에 접근하는 주소값을 4bytes씩 옮기기 위한 코드다. right shift를 하기 위해서는 `srl`을 사용한다.

### MIPS Procedure

procedure는 함수를 의미한다. 어셈블리 레벨에서 함수를 만들고 호출하는 것은 하이레벨 언어에서 하던 것과는 많이 다르다. 여기서 가장 중요한 것은 레지스터의 백업과 점프다.

#### Leaf Procedure

호출된 함수에서 다른 함수를 호출하지 않는 함수, 즉 **leaf procedure**를 가정해보자:

```c
int leaf_procedure(int a, b, c, d) {
  int e;
  e = (a + b) - (c -d);
  return e;
}
```

`a`부터 `d`까지가 `$a0`부터 `$a3`에 대응되고, `e`는 `$s0`에 대응된다고 하면 MIPS 코드는 다음과 같다:

```mips
main:
  jal leaf_procedure # leaf_procedure 호출
  j exit
leaf_procedure:
  addi $sp, $sp, -12 # 4bytes 레지스터 3개 백업을 위해 stack pointer 위치 -12 이동
  sw $t1, 8($sp) # 8($sp) = $t1
  sw $t0, 4($sp) # 4($sp) = $t0
  sw $s0, 0($sp) # 0($sp) = $s0
  add $t0, $a0, $a1
  add $t1, $a2, $a3
  sub $s0, $t0, $t1
  add $v0, $s0, $zero
  lw $s0, 0($sp) # $s0 = 0($sp)
  lw $t0, 4($sp) # $t0 = 4($sp)
  lw $t1, 8($sp) # $t1 = 8($sp)
  addi $sp, $sp, 12 # stack pointer 위치 복원
  jr $ra # $ra 위치로 점프
exit:
  ...
```

...왜 이런 짓을 하는걸까? 하나씩 살펴보자.

```mips
main:
  jal leaf_procedure # leaf_procedure 호출
  j exit
```

먼저 `jal`을 통해 `leaf_procedure` 라벨로 이동한다. 이때, 레지스터의 `$ra`(return address)는 program counter의 값을 가져온다. program counter는 프로세스가 자신의 instruction을 어디까지 실행했는지 체크하기 위한 값이다. 이 경우 `$ra`는 `jal leaf_procedure` 바로 다음 라인 `j exit`를 가리킨다.

```mips
leaf_procedure:
  addi $sp, $sp, -12 # 4bytes 레지스터 3개 백업을 위해 stack pointer 위치 -12 이동
```

`leaf_proceduer`에서는 먼저 레지스터의 `$sp`(stack pointer)에 4bytes 레지스터 3개를 백업하기 위해 `$sp`에 `-12`를 더했다. `$sp`는 메모리의 스택의 특정 주소를 가리키는 레지스터이며, 이 위치를 옮기는 것은 백업을 위한 공간을 확보하는 것이다.

```mips
sw $t1, 8($sp) # 8($sp) = $t1
sw $t0, 4($sp) # 4($sp) = $t0
sw $s0, 0($sp) # 0($sp) = $s0
```

그리고 `sw`를 통해 `$t1`, `$t0`, `$s0`를 `$sp`의 각 공간에 담았다. (큰 값부터 접근하는 이유는 메모리의 스택 주소가 큰 쪽에서 작은 쪽으로 향하기 때문이다.) 이렇게 하는 이유는 `leaf_procedure`를 호출한 caller측(이 경우 `main`)에서 `$t1`이나 `$t0`, `$s0` 레지스터를 사용하고 있을 수도 있기 때문이다. 만약 스택에 백업하지 않는다면 caller에서 사용하던 값을 덮어씌워 버릴 것이다.

```mips
add $t0, $a0, $a1
add $t1, $a2, $a3
sub $s0, $t0, $t1
add $v0, $s0, $zero
```

`e = (a + b) - (c -d)`에 해당하는 연산을 수행한다.

```mips
lw $s0, 0($sp) # $s0 = 0($sp)
lw $t0, 4($sp) # $t0 = 4($sp)
lw $t1, 8($sp) # $t1 = 8($sp)
```

`lw`를 통해 `$sp`에 저장한 값을 다시 불러왔다. stack pointer도 다시 12bytes 당겼다.

```mips
jr $ra # $ra 위치로 점프
```

`jr`을 통해 caller에 위치한 `$ra`로 돌아가 `j exit`를 실행한다.

여기서는 `$t1`과 `$t0`도 백업을 했는데, 사실 이럴 필요는 없다. `$t` 레지스터는 temporary register이기 때문에 언제나 임시 값만 저장하도록 약속되어있다. 따라서 `$t` 레지스터에는 값이 덮어씌워져도 문제가 없도록 코드를 짜야한다.

#### Non-Leaf Procedure

함수 안에서 다른 함수를 호출하는 non-leaf procedure는 어떨까? 이렇게 호출이 중첩된 경우에는 `$ra`에 저장된 callr의 위치가 덮어 씌워져 무한 루프에 빠질 위험이 있다. 일단 하이레벨 코드를 보자:

```c
int factorial(int n) {
  if (n < 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
```

recursive하게 동작하는 팩토리얼 함수다. `n`이 `$a0`에, 결과값이 `$v0`에 대응된다고 가정하면 MIPS 코드는 다음과 같다:

```mips
factorial:
  addi $sp, $sp, -8 # stack pointer 위치 -8 이동
  sw $ra, 4($sp)
  sw $a0, 0($sp)
  slti $t0, $a0, 1 # $t0 = ($a0 < 1)
  beq $t0, $zero, L1 # if ($t0 == 0) { goto L1 }
  addi $v0, $zero, 1
  addi $sp, $sp, 8 # stack pointer 위치 8 이동
  jr $ra
L1:
  addi $a0, $a0, -1 # $a -= 1
  jal factorial # factorial($a0)
  lw $a0, 0($sp)
  lw $ra, 4($sp)
  addi $sp, $sp, 8 # stack pointer 위치 8 이동
  mul $v0, $a0, $v0 # $v0 = $a0 * $v0
  jr $ra
```

굉장히 복잡해보이지만, 하나씩 뜯어보면... 진짜 복잡하다. 작동 방식은 대략 재귀적으로 함수를 호출하면서 stack pointer를 밀어내며 값을 백업하다가, 이후 다시 stack pointer를 당기며 값을 가져와 결과를 내는 식이다. `$a0`가 3이라고 가정하고 모든 instruction 단계를 step by step으로 한 단계 한 단계 살펴보자.

```mips
factorial:
  addi $sp, $sp, -8 # stack pointer 위치 -8 이동
  sw $ra, 4($sp)
  sw $a0, 0($sp)
```

먼저 `factorial` 함수에 진입해 stack pointer를 이동시키고 `$ra`와 `$a0` 레지스터를 백업했다. 이때 **`$ra`는 `factorial` 함수를 호출한 위치**가 될 것이고, **`$a0`는 앞서 가정한 3**이 된다. 스택의 모습은 다음과 같다:

```
+--------+------------+
| $a = 3 | caller $ra |
+--------+------------+
```

이제 다음 라인을 보자:

```mips
slti $t0, $a0, 1 # $t0 = ($a0 < 1)
beq $t0, $zero, L1 # if ($t0 == 0) { goto L1 }
```

`$a0`가 1보다 작은지 확인하고, 그 반환 값을 `$t0`에 저장한다. 그리고 `$t0`가 `$zero`와 같은지 확인해 값이 같다면 `L1` 라벨로 이동한다. 이때 **`$a0`는 3**이기 때문에 1보다 작지 않다. 따라서 **`$t0`는 0**이 되고, `beq`를 만족해 `L1`으로 넘어간다.

```mips
L1:
  addi $a0, $a0, -1 # $a -= 1
  jal factorial # factorial($a0)
```

`L1`은 하이레벨 코드에서 `return n * factorial(n - 1);`에 해당하는 동작을 정의한다. 먼저 `$a0`에서 1을 뺀다. 그리고 다시 `factorial` 함수를 호출한다.

```mips
factorial:
  addi $sp, $sp, -8 # stack pointer 위치 -8 이동
  sw $ra, 4($sp)
  sw $a0, 0($sp)
```

`factorial`은 `$sp`를 다시 -8 이동한다. 그리고 `$ra`와 `$a0`를 백업한다. 이때 **`$ra`는 앞서 실행한 `L1`의 `jal factorial`의 바로 다음 라인**이고, **`$a0`는 2**가 된다. 현재 스택에 저장된 레지스터 값을 표현하면 다음과 같다:

```
+--------+------------+--------+--------+
| $a = 3 | caller $ra | $a = 2 | L1 $ra |
+--------+------------+--------+--------+
```

이어서 다음 라인을 살펴보자:

```mips
slti $t0, $a0, 1 # $t0 = ($a0 < 1)
beq $t0, $zero, L1 # if ($t0 == 0) { goto L1 }
```

`$a0`가 2이므로 1보다 작지 않다. `$t0`가 0이 되고, `beq`를 만족해 다시 `L1`으로 넘어간다.

```mips
L1:
  addi $a0, $a0, -1 # $a -= 1
  jal factorial # factorial($a0)
```

`L1`은 아까와 마찬가지로 `$a`에서 1을 빼 1로 만들고, 다시 `factorial`로 넘어간다.

```mips
factorial:
  addi $sp, $sp, -8 # stack pointer 위치 -8 이동
  sw $ra, 4($sp)
  sw $a0, 0($sp)
```

`factorial`에서는 `$sp`를 다시 -8 이동한다. 이때 백업되는 **`$ra`는 앞서 실행한 `L1`의 `jal factorial`의 바로 다음 라인**이고, **`$a0`는 1**이다. 현재 스택에 저장된 레지스터 값은 다음과 같다:

```
+--------+------------+--------+--------+--------+--------+
| $a = 3 | caller $ra | $a = 2 | L1 $ra | $a = 1 | L1 $ra |
+--------+------------+--------+--------+--------+--------+
```

다음 라인으로 넘어가자:

```mips
slti $t0, $a0, 1 # $t0 = ($a0 < 1)
beq $t0, $zero, L1 # if ($t0 == 0) { goto L1 }
```

여전히 `$a0`가 1이므로 1보다 작지 않고, `beq`를 만족해 `L1`으로 넘어간다.

```mips
L1:
  addi $a0, $a0, -1 # $a -= 1
  jal factorial # factorial($a0)
```

`L1`은 `$a`에서 1을 빼 0으로 만들고, `factorial`로 넘어간다.

```mips
factorial:
  addi $sp, $sp, -8 # stack pointer 위치 -8 이동
  sw $ra, 4($sp)
  sw $a0, 0($sp)
```

`factorial`에서는 또 다시 `$sp`를 -8 이동한다. 이때 백업되는 **`$ra`는 앞서 실행한 `L1`의 `jal factorial`의 바로 다음 라인**이고, **`$a0`는 0**이다. 현재 스택에 저장된 레지스터 값은 다음과 같다:

```
+--------+------------+--------+--------+--------+--------+--------+--------+
| $a = 3 | caller $ra | $a = 2 | L1 $ra | $a = 1 | L1 $ra | $a = 0 | L1 $ra |
+--------+------------+--------+--------+--------+--------+--------+--------+
```

다음 라인을 보자:

```mips
slti $t0, $a0, 1 # $t0 = ($a0 < 1)
beq $t0, $zero, L1 # if ($t0 == 0) { goto L1 }
```

이젠 **`$a0`가 0**이므로 1보다 작아 **`$t0`가 1**이 된다. `beq`를 만족하지 않으므로 `L1`으로 넘어가지 않고 다음 라인을 실행한다. 여기까지 호출 과정이었고, 이제는 반환 값을 받아오는 과정을 반복한다.

```mips
addi $v0, $zero, 1
addi $sp, $sp, 8 # stack pointer 위치 8 이동
jr $ra
```

`$v0`에 0에 1을 더한 값, 즉 1을 저장한다. 그리고 stack pointer 위치를 8만큼 당기고 `$ra` 위치로 넘어간다. 이때 **`$ra`는 `L1 $ra` 위치**다.

```
+--------+------------+--------+--------+--------+--------+
| $a = 3 | caller $ra | $a = 2 | L1 $ra | $a = 1 | L1 $ra |
+--------+------------+--------+--------+--------+--------+
```

stack pointer 위치를 8만큼 당겼으니 스택의 모습은 위와 같이 된다.

```mips
lw $a0, 0($sp)
lw $ra, 4($sp)
addi $sp, $sp, 8 # stack pointer 위치 8 이동
mul $v0, $a0, $v0 # $v0 = $a0 * $v0
jr $ra
```

스택에서 `$a0` 값과 `$ra` 값을 가져온다. 앞선 스택의 모습을 확인해보면 **`$a0`가 1**이고 `$ra`는 **`L1 $ra` 위치**다. 그리고 다시 stack pointer의 위치를 8 움직인다. 이어서 `$v0`에 `$a0 * $v0`, 즉 `1 * 1` 값을 저장하고, `$ra` 위치로 넘어간다. **`$ra`는 여전히 `L1 $ra` 위치**다.

```
+--------+------------+--------+--------+
| $a = 3 | caller $ra | $a = 2 | L1 $ra |
+--------+------------+--------+--------+
```

앞서 stack pointer의 위치를 8 움직였기 때문에 현재 스택의 모습은 위와 같다.

```mips
lw $a0, 0($sp)
lw $ra, 4($sp)
addi $sp, $sp, 8 # stack pointer 위치 8 이동
mul $v0, $a0, $v0 # $v0 = $a0 * $v0
jr $ra
```

이 과정을 반복한다. `$a0`와 `$ra`를 복원한다. 이제 **`$a0`가 2**이고 **`$ra`는 `L1 $ra` 위치**다. 그리고 다시 stack pointer의 위치를 8 움직인다. 이어서 `$v0`에 `$a0 * $v0`, 즉 `2 * 1` 값을 저장하고, `$ra` 위치로 넘어간다. **`$ra` 는 `L1 $ra` 위치**다.

```
+--------+------------+
| $a = 3 | caller $ra |
+--------+------------+
```

stack pointer가 8만큼 이동한 현재 스택의 모습은 위와 같다.

```mips
lw $a0, 0($sp)
lw $ra, 4($sp)
addi $sp, $sp, 8 # stack pointer 위치 8 이동
mul $v0, $a0, $v0 # $v0 = $a0 * $v0
jr $ra
```

이제 마지막 단계다. 스택에서 `$a0`와 `$ra`를 가져온다. 이제 **`$a0`가 3**이고 **`$ra`는 `caller $ra` 위치**다. 다시 stack pointer의 위치를 8 움직이면 이제 stack pointer를 초기 값으로 돌려놓게 된다.

`$v0`에 `$a0 * $v0`, 즉 `3 * 2` 값을 저장하고, `$ra` 위치로 넘어간다. 이때 **`$ra`는 caller 위치**이며, caller에서 `$v0`에 접근하면 6을 얻을 수 있을 것이다. `factorial`이 제대로 동작했다.

마치 인간 컴퓨터가 된 기분이다.

### Memory Layout

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

그림의 Code Segment는 Text라고 불리며, 실제 프로그램 코드가 저장된다. Data Segment는 Static Data라고 불리며, 상수 배열이나 문자열, static 변수가 저장된다. Heap에는 동적할당된 배열 요소나 객체가 저장되며, Stack에는 함수나 메소드, 지역변수 등이 저장된다.

앞서 스택에 값을 저장하고 불러오는 과정이 위와 같은 메모리 구조를 바탕으로 이뤄진다. 스택은 높은 곳에서 낮은 곳으로 자라기 때문에 `addi $sp, $sp, -8`처럼 stack poniter를 음의 방향으로 움직여준 것이다. 값을 저장할 때도 `sw $ra 4($sp)`다음 `sw $a0, 0($sp)`를 했다. 스택과 달리 heap은 낮은 곳에서 높은 곳으로 자란다.

### MIPS Instruction Formats

MIPS에서 어셈블러가 한 줄씩 instruction을 읽고 이를 기계어로 변환할 때, 기계어를 표현하는 세가지 형식 R(Register), I(Immediate), J(Jump)가 있다.

#### R-format

R-format은 레지스터를 이용해 연산하는 instruction을 담는 형식이다.

```
+----+----+----+----+-------+-------+
| op | rs | rt | rd | shamt | funct |
+----+----+----+----+-------+-------+
```

* op(6bits): 포맷과 동작을 구분하는 필드.
* rs(5bits): first source register number
* rt(5bits): second source register number
* rd(5bits): destination register number
* shamt(5bits): shift 연산에 사용되는 필드.
* funct(6bits): op보다 구체적인 정보를 담은 필드.

만약 다음과 같은 MIPS 코드가 있다고 가정해보자:

```mips
add $t0, $s1, $s2
```

이를 R-format으로 표현하면 이렇게 될 것이다:

```
+---------+-----+-----+-----+---+-----+
| special | $s1 | $s2 | $t0 | 0 | add |
+---------+-----+-----+-----+---+-----+
```

register table에 따라 이것을 10진수로 변환하면:

```
+---+----+----+---+---+----+
| 0 | 17 | 18 | 8 | 0 | 32 |
+---+----+----+---+---+----+
```

각 레지스터의 값과 `add` instruction의 opcode, funct 값, rs, rt, rd 위치 등은 모두 사전에 정의된 것으로, [MIPS Green Sheet](https://inst.eecs.berkeley.edu/~cs61c/resources/MIPS_Green_Sheet.pdf)를 참고하면 된다. 이어서 각 필드를 2진수로 바꾸면 실제 메모리에 들어가는 값이 된다:

```
00000010001100100100000000100000
```

컴퓨터는 이렇게 변환된 바이너리 숫자를 보고 명령을 수행한다.

이렇게 보면 바로 funct를 확인하면 되니까 op가 필요하지 않을 것 같다. 사실 32bit 시스템에서 쉽게 instruction을 읽기 위해 32비트를 맞추는 것이 복잡도를 줄이는 데 도움이 되기 때문에 메모리 손해를 감안한 것이다.

#### I-format

I-format은 상수 연산과 메모리 연산을 위해 사용된다.

```
+----+----+----+-----+
| op | rs | rt | IMM |
+----+----+----+-----+
```

* op(6bits): 포맷과 동작을 구분하는 필드.
* rs(5bits), rt(5bits): source or destination register number
* IMM(16bits): constant나 address가 담긴다. constant의 경우 -215부터 215 - 1까지의 상수를 저장할 수 있다. address의 경우 rs의 base address에 offset으로 기능하거나 점프해야 하는 instruction까지의 거리를 저장한다.

#### J-format

J-format은 다른 위치로 점프할 때 사용되는 포맷이다.

```
+----+----------------+
| op | pseudo-address |
+----+----------------+
```

* op(6bits): 포맷과 동작을 구분하는 필드.
* pseudo-address(26bits): 점프할 instruction의 변환된 주소가 담기는 필드.

### MIPS Addressing for 32-bit Immediates and Addresses

MIPS instruction format 중 I-format은 `bne $t0, $s5, Exit`와 같은 구문을 표현할 때도 사용된다. 그런데 I-foramt의 마지막 필드인 constant or address는 16bits밖에 되지 않아 `Exit`에서 수행될 동작 전체를 담는 것은 불가능하다. 따라서 이곳에는 `Exit`가 몇 줄 떨어져 있는지를 저장한다. 앞서 활용한 Loop 코드를 다시 보자:

```mips
Loop:                 # address: 8000
  sll $t1, $s3, 2     # R-format: | 0  | 0  | 19 | 9 | 4 | 0  |
  add $t1, $t1, $s6   # R-format: | 0  | 9  | 22 | 9 | 0 | 32 |
  lw $t0, 0($t1)      # I-format: | 35 | 9  | 8  |     0      |
  bne $t0, $s5, Exit  # I-format: | 5  | 8  | 21 |     2      |
  addi $s3, $s3, 1    # I-format: | 8  | 19 | 19 |     1      |
  j Loop              # J-format: | 2  |         2000         |
Exit:
  ...
```

여기서 `bne $t0, $s5, Exit` 라인의 I-format을 보자. constant or address에 2가 있는 것을 볼 수 있는데, 이는 Exit가 해당 라인에서 2칸 떨어져 있다는 의미다.

J-format의 경우도  pseudo-address 필드가 26bits밖에 되지 않아 모든 instruction을 담을 수 없다. J-format의  pseudo-address 필드에는 점프해야 하는 위치의 주소를 2만큼 right shift한 값이 들어간다. 위 코드에서 `j Loop` 라인의 J-format을 보자. pseudo-address 필드에 2000이 있는데, 점프해야 하는 `Loop`의 address는 8000이다. 이때 2000에 2만큼 left shift(`2000 << 2`)하면 8000을 얻을 수 있다.

위와 같은 매커니즘을 수행하기 위해 어셈블러는 구체적인 instruction을 기계어로 변환하기 전 코드 전체를 스캔해 라벨의 위치를 파악한다. 이후 순서대로 instruction을 읽으며 기계어로 변환하다가 점프해야 하는 부분이 나오면 그 부분의 instruction을 기계어로 변환한다. 이런 식으로 모든 instruction을 순서에 맞춰 기계어로 변환하면 비로소 컴퓨터가 이해할 수 있는 결과물이 나온다.

여기까지가 MIPS instruction에 대한 기본적인 내용이다. 더 들어가면 프로세서, 메모리의 동작이나 디지털 회로를 이용한 바이너리 연산에 대한 내용도 다룰 수 있을 것 같은데, 일단은 컴퓨터 아키텍처의 개요와 컴퓨터가 코드를 해석하고 실행하는 과정만을 살펴봤다.
