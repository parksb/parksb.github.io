---
id: 17
title: "Java Design Pattern: Singleton"
subtitle: ""
date: "2018.06.15"
---

Singleton 패턴은 하나만 존재해야 하는 오브젝트를 만들 때 유용한 디자인 패턴이다. 간단히 구현해보자.

```java
public class Singleton {
  private static Singleton instance;

  private Singleton() {}

  public static Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }

    return instance;
  }
}
```

constructor를 private으로 정의하고, instance에 접근하기 위해서는 반드시 `getInstance` 메소드를 거치도록했다. 이제 한 번 인스턴스가 생성된 이후에는 또 다른 인스턴스가 생성될 일이 없다.

하지만 이렇게만 하면 멀티스레딩 환경에서 동기화가 제대로 되지 않을 경우 인스턴스가 두 개 만들어질 수 있다.

```java
public class Singleton {
  private static Singleton instance;

  private Singleton() {}

  public static synchronized Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }

    return instance;
  }
}
```

`getInstance`를 synchronized로 해주면 한 번에 하나의 스레드만 메소드에 접근할 수 있기 때문에 동기화 문제가 해결된다.
