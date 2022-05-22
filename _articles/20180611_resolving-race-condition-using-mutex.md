---
id: 16
title: "Race condition 발생시키고 Mutex lock으로 해결하기"
subtitle: ""
date: "2018.06.11"
---

race condition은 두 개 이상의 프로세스나 스레드가 하나의 데이터를 공유할 때 데이터가 동기화되지 않는 상황을 말한다. ([공룡책으로 정리하는 운영체제 Ch.6](https://parksb.github.io/article/10.html)에 정리했다.) 그리고 코드에서 이러한 문제가 발생할 수 있는 부분을 critical section이라고 하며, 이 문제를 해결하기 위해 한 번에 하나의 스레드만 critical section에 진입할 수 있도록 제어하는 기법을 mutex lock이라고 한다.

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

반복문을 10만번 돌면서 시간, 스레드 이름, `count` 순서로 로그를 한 줄씩 남기도록 수정하고 실행한다.

![로그. 0, 1, 3, 4, 5, 7 순차적이지 않게 로그가 남았다.](/images/50655469-a575fd00-0fd3-11e9-86c4-54add9d239f4.webp)

엄청난 빈도로 race condition이 발생했으며, 최종 결과가 정확히 300000으로 떨어지지 않았다. 이에 앞서 VM에서 테스트하면서 race condition이 일어나지 않아 삽질을 많이 했는데, VM을 싱글 코어로 설정해서 그런 것이었다.

![싱글 코어 환경에서의 로그. 31642, 31643, 31644 순차적으로 로그가 남았다.](/images/50655465-a3ac3980-0fd3-11e9-856b-a5f67445bb09.webp)

위와 같이 싱글 코어 환경에서는 한 번에 하나의 스레드만 실행되기 때문에 race condition이 발생하지 않는다.

다시 멀티 코어 환경으로 돌아와서, race condition을 mutex lock으로 해결해본다.

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

![로그. 299978, 299979, 299980 순차적으로 로그가 남았다.](/images/50655470-a870ed80-0fd3-11e9-9917-b1fede3dcea0.webp)

최종 값은 299999였다. `counter`가 0에서 출발하니까 최종 값이 299999이어야 각 스레드가 100000번씩 수행되었다는 의미가 된다. 잘 동작했다.
