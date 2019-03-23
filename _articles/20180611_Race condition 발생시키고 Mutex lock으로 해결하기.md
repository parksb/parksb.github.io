---
id: 16
title: "Race condition 발생시키고 Mutex lock으로 해결하기"
subtitle: ""
date: "2018.06.11"
tags: "운영체제"
---

race condition은 [공룡책으로 정리하는 운영체제 Ch.6](https://parksb.github.io/article/10.html)에 정리되어 있는데, 간단히 말하자면 두 개 이상의 프로세스나 스레드가 하나의 데이터를 공유할 때 데이터가 동기화되지 않는 상황을 말한다. 그리고 코드에서 이러한 문제가 발생할 수 있는 부분을 critical section이라고 하며, 이 문제를 해결하기 위해 한 번에 하나의 스레드만 critical section에 진입할 수 있도록 제어하는 기법을 mutex lock이라고 한다.

CentOS에서 3개의 스레드를 운영하는 프로그램을 짜고, race condition을 발생시킨 뒤 mutex lock을 통해 해결해보려 한다. 먼저 3개의 스레드를 만들어보자.

```c
#include <stdio.h>
#include <pthread.h>
#include <time.h>

void* performThread(void* data);

int count = 0;

int main(int argc, char* argv[]) {
  pthread_t threads[3];
  char threadNames[3][128] = {
    {"thread1"},
    {"thread2"},
    {"thread3"}
  };

  pthread_create(&threads[0], NULL, performThread, (void*)threadNames[0]);
  pthread_create(&threads[1], NULL, performThread, (void*)threadNames[1]);
  pthread_create(&threads[2], NULL, performThread, (void*)threadNames[2]);

  printf("%d\n", count);

  return 0;
}

void* performThread(void* data) {
  count++;
}
```

3개의 스레드가 차례대로 `count`를 증가시켰기 때문에 예상대로 결과는 3이 나온다. 이걸 조금 바꿔서 `count`를 10만번 증가시키고, 모든 내용을 로그에 남기도록 하려한다. `performThread`만 수정해주면 된다.

```c
void* performThread(void* data) {
  time_t currentTime;
  struct tm* timeInfo;
  char currentTimeString[128];

  char* threadName = (char*)data;
  FILE* file;
  int i = 0;

  file = fopen("event.log", "a");

  for (i = 0; i < 100000; i++) {
    time(&currentTime);
    timeInfo = localtime(&currentTime);
    strftime(currentTimeString, 128, "%Y-%m-%d %H:%M:%S", timeInfo);

    fprintf(file, "%s\t%s\t%d\n", currentTimeString, threadName, count);

    count++;
  }

  fclose(file);
}
```

반복문을 10만번 돌면서 시간, 스레드 이름, `count` 순서로 로그를 한 줄씩 남기도록 수정했다. 그리고 race condition이 발생할 때까지 여러 차례 실행시켰다.

![여러번 프로그램을 실행시킨 터미널.](https://user-images.githubusercontent.com/6410412/50655460-9ee78580-0fd3-11e9-822e-a9f79dfc03cf.png)

race condition이 발생했다면 결과값이 300000이 나오지는 않았을 것이다. 몇 번을 실행해도 좀처럼 race condition이 발생하지 않았다. 생각보다 race condition이 잘 일어나지 않는 것 같다. 그래서 로그를 분석하여 race condition이 발생했다면 발생한 위치를 알려주고, 그렇지 않다면 로그를 삭제한 뒤 다시 프로그램을 실행시키는 checker 프로그램을 만들었다. 이제 처음 한 번만 프로그램을 실행시키면, 프로그램이 작업을 마칠 때 checker를 실행시키고, checker는 로그를 분석해 결과를 알려준다. 완전히 자동화된 것이다.

![터미널. A race condition occurs between 31649 and 31651 알림.](https://user-images.githubusercontent.com/6410412/50655462-a149df80-0fd3-11e9-9fdb-2f889b24da90.png)

몇 번 테스트를 반복하니 반가운 메시지가 출력되었다. 그리고 바로 로그를 열어 31649를 찾았다.

![레이스 컨디션이 발생한 로그.](https://user-images.githubusercontent.com/6410412/50655465-a3ac3980-0fd3-11e9-856b-a5f67445bb09.png)

두 라인에 걸쳐 `counter` 값이 31649로 찍힌 것을 볼 수 있다. 그런데 최종 결과값은 300000에 턱없이 모자른 32750쯤이 나왔다. 스레드 수행도 1, 2, 3 순서대로 딱 맞아 떨어져 아무래도 찝찝했다. 윈도우에서 테스트했던 결과와 비교해봤다.

![윈도우에서 테스트한 로그.](https://user-images.githubusercontent.com/6410412/50655469-a575fd00-0fd3-11e9-86c4-54add9d239f4.png)

윈도우에서는 한 번에, 그것도 엄청나게 높은 빈도로 race condition이 발생했으며, 최종 결과도 300000에 가까웠다. CentOS는 VM 위에서 구동한 것이고, 윈도우는 physical machine에서 구동한 것이라 결과에 차이가 있는 듯하다.

그리고 이걸 mutex lock으로 해결해본다.

```c
#include <stdio.h>
#include <pthread.h>
#include <time.h>

void* performThread(void* data);

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
int counter = 0;
FILE* file;

int main(int argc, char* argv[]) {
  pthread_t threads[3];
  char threadNames[3][128] = {
    {"thread1"},
    {"thread2"},
    {"thread3"}
  };
  int i = 0;

  file = fopen("event.log", "a");

  for (i = 0; i < 100000; i++) {
    pthread_create(&threads[0], NULL, performThread, (void*)threadNames[0]);
    pthread_create(&threads[1], NULL, performThread, (void*)threadNames[1]);
    pthread_create(&threads[2], NULL, performThread, (void*)threadNames[2]);
  }

  printf("Done: %d\n", counter);
  fclose(file);

  return 0;
}

void* performThread(void* data) {
  pthread_mutex_lock(&mutex);

  time_t currentTime;
  struct tm* timeInfo;
  char currentTimeString[128];
  char* threadName = (char*)data;

  time(&currentTime);
  timeInfo = localtime(&currentTime);
  strftime(currentTimeString, 128, "%Y-%m-%d %H:%M:%S", timeInfo);

  fprintf(file, "%s\t%s\t%d\n", currentTimeString, threadName, counter);

  counter++;

  pthread_mutex_unlock(&mutex);
}
```

먼저 `mutex` 변수를 만들었다. 그리고 critical section은 `performThread` 함수에서 로그를 남기고 `counter`를 증가시키는 부분이므로, 스레드가 `performThread`에 진입할 때 lock해 다른 스레드가 진입할 수 없도록 만든 후 나올 때는 unlock해주도록 했다.

![레이스 컨디션이 발생하지 않은 로그.](https://user-images.githubusercontent.com/6410412/50655470-a870ed80-0fd3-11e9-9917-b1fede3dcea0.png)

checker에도 문제 없었고, 최종 값도 299999였다. (`counter`가 0에서 출발하니까 최종 값이 299999이어야 각 스레드가 100000번씩 수행되었다는 의미가 된다.) 아주 잘 작동한다!