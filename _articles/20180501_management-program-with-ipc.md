---
id: 3
title: "프로세스간 통신을 활용해 프로그래밍하기"
subtitle: "학적 관리 프로그램 만들기"
date: "2018.05.01"
---

컴퓨터는 여러 개의 프로세스를 동시에 돌릴 수 있다. (사실 정확히 '동시에'는 아니다. 자세한 설명은 [공룡책으로 정리하는 운영체제 Ch.1](https://parksb.github.io/article/5.html)를 참고.) 그렇다면 하나의 프로그램이 여러 개의 프로세스로 메모리에 로드될 수 있을까? 당연히 된다. 두 개의 프로세스를 동시에 실행시며 하나의 목적을 달성할 수 있다. 리눅스 환경에서 parent 프로세스와 child 프로세스가 통신하는 학생 정보 관리 프로그램을 만들어보았다.

## 프로그램 구조

![프로그램 구조 도식화. 클라이언트와 서버가 파이프로 통신. 서버는 파일에 접근.](/images/43831555-7d8fb438-9b3f-11e8-96e0-ccfd782d089d.webp)

프로그램은 parent와 child로 나뉜다. parent는 클라이언트로서 사용자에게 메뉴를 출력해주고, 값을 입력받는다. child는 서버로서 parent에게 데이터를 전송받아 student.data 파일에 데이터를 쓰거나 읽는다. 전체 실행 흐름을 도식화하면 다음 플로우 차트와 같다.

![플로우 차트.](/images/43831554-7d0c6466-9b3f-11e8-8da3-a5c293503a5a.webp)

서버와 클라이언트는 파이프(Pipe)를 통해 데이터를 주고 받는다. 파이프가 무엇인가? 말 그대로 parent와 child 사이에 관을 설치해 데이터를 주고받는 프로세스간 통신 기법을 말한다. [공룡책으로 정리하는 운영체제 Ch.3](https://parksb.github.io/article/7.html)에 파이프에 대한 설명이 있다.

## Child 프로세스 생성

처음 프로그램이 실행됐을 때 `fork()` 시스템콜을 통해 child 프로세스를 만들어야 한다.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char* argv[]) {
  pid_t pid = fork(); // child를 생성한다.

  if (pid < 0) { // 에러
    printf("[CLIENT] Fork failed.\n");
    return 1;
  } else if (pid == 0) { // Child (Server)
    printf("[SERVER] Child created.\n");
    return 0;
  } else { // Parent (Client)
    wait(NULL); // child를 기다린다.
  }
  return 0;
}
```
```bash
$ ./debug
[SERVER] Child Created.
```

`fork()`를 수행하면 child 프로세스가 생성된다. fork 이후 코드는 모두 parent와 child에서 동시에 실행된다. parent는 `wait(NULL)`을 통해 child의 작업이 끝날 때까지 대기한다. 이를 이용해 parent에서 사용자로부터 데이터를 입력받고 child에서 출력해보도록 하자.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char* argv[]) {
  int cmd = 0;
  pid_t pid  = fork(); // child를 생성한다.

  if (pid < 0) { // 에러
    printf("[CLIENT] Fork failed.\n");
    return 1;
  } else if (pid == 0) { // Child (Server)
    printf("[SERVER] Received %d.\n", cmd);
    return 0;
  } else { // Parent (Client)
    printf("[1] search [2] create\n");
    printf("> ");

    scanf("%d", &cmd);
    wait(NULL); // child를 기다린다.
  }
  return 0;
}
```
```bash
$ ./debug
[1] search [2] create
[SERVER] Received 0.
>
```

안타깝지만 생각대로 동작하지 않는다. 사용자로부터 `cmd`의 값이 할당되는 부분은 parent이며, 변경된 `cmd`는 parent에만 존재한다. 따라서 동시에 실행되고 있는 child에서는 `cmd`의 값이 변경되지 않고 `0`이 출력된다. `cmd` 값을 child에게 전송하고, child가 `cmd`값을 수신할 때까지 대기하는 부분은 따로 구현해야 한다.

## 파이프 통신 구현

child에게 `cmd` 값을 전송하려면 파이프가 필요하다. 만들어보자.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>

int main(int argc, char* argv[]) {
  int cmd = 0;
  int p[2]; // p[0]: read, p[1]: write

  pipe(p); // 파이프를 생성한다.
  pid_t pid  = fork(); // child를 생성한다.

  if (pid < 0) { // 에러
    printf("[CLIENT] Fork failed.\n");
    return 1;
  } else if (pid == 0) { // Child (Server)
    printf("[SERVER] Received %d.\n", cmd);
    return 0;
  } else { // Parent (Client)
    printf("[1] search [2] create\n");
    printf("> ");

    scanf("%d", &cmd);
    wait(NULL); // child를 기다린다.
  }
  return 0;
}
```

파이프는 단방향 통신만 되기 때문에 읽기 파이프와 쓰기 파이프 두 개가 필요하다. 이제 두 개의 파이프를 만들었으니 child에게 `cmd`를 전송해보자.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <sys/types.h>

int main(int argc, char* argv[]) {
  int cmd = 0;
  int p[2]; // p[0]: read, p[1]: write

  pipe(p); // 파이프를 생성한다.
  pid_t pid  = fork(); // child를 생성한다.

  if (pid < 0) { // 에러
    printf("[CLIENT] Fork failed.\n");
    return 1;
  } else if (pid == 0) { // Child (Server)
    read(p[0], &cmd, sizeof(cmd)); // 파이프로 전송된 값을 받는다.
    printf("[SERVER] Received %d.\n", cmd);
    return 0;
  } else { // Parent (Client)
    printf("[1] search [2] create\n");
    printf("> ");
    scanf("%d", &cmd);

    write(p[1], &cmd, sizeof(cmd)); // 파이프를 통해 값을 전송한다.
    wait(NULL); // child를 기다린다.
  }
  return 0;
}
```
```bash
$ ./debug
[1] search [2] create
> 1
[SERVER] Received 1.
```

child는 생선된 이후 파이프를 통해 데이터가 전달되기를 기다린다. parent는 사용자에게 `cmd` 값을 입력받고 쓰기 파이프인 `p[1]`를 통해 `cmd` 값을 전송한다. 그리고 수신을 기다리던 child는 `p[0]`을 통해 전달된 `cmd` 값을 읽어들인다.

child 프로세스 생성과 파이프를 통한 두 프로세스의 통신. 핵심적인 부분은 이정도다. 사실 이후 내용은 프로세스를 다루는 것과는 너무 관련이 없어서 제외했다.
