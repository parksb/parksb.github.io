---
id: 26
title: "🎅 요정을 착취하는 방치형 게임 개발한 이야기"
subtitle: "ES6 OOP와 타입스크립트, 그리고 제이쿼리(?)"
date: "2018.12.26"
---

[Santa Inc.](https://parksb.github.io/santa-inc/)는 초국적 블랙 기업 '산타 주식회사'를 운영하는 방치형 게임(Idle game)이다. 산타의 목적은 오직 선물 생산을 최대로 끌어올리는 것. 산타는 직원을 고용하고, 정책을 채택하며 끝없이 선물을 생산한다.

![Santa Inc. 세계를 선도하는 글로벌 기업. 루돌프.](/images/169650971-29af61d4-94a0-47f9-8f08-edb34eb996f5.webp)

Santa Inc.를 처음 만든 건 2015년 겨울이었다. 웹 프로그래밍을 공부한 후 매년 크리스마스마다 이상한 걸 만들었는데, 이것도 그 일환이었다. 당시엔 크리스마스에 맞춰 런칭하겠다는 욕심으로 학기 중 20일만에 게임을 완성했다. 물론 코드가 엉망진창이었다.

그리고 2018년, 엉망이던 코드를 ES6 클래스 문법과 타입스크립트를 이용해 (아마도) 깔끔하게 정리했다.

## 😈 산타가 되어 루돌프와 요정을 착취해보세요!

<!-- markdown-link-check-disable-next-line -->
처음 아이디어는 '산타가 요정을 고용해 회사를 운영하는 게임'이었다. 어렸을 때 줄기차게 한 롤러코스터 타이쿤이나 로코모션급의 시뮬레이션 게임...이 이상적이긴 하지만 당장 만드는 건 무리였다. 대신 [Cookie Clicker](http://orteil.dashnet.org/cookieclicker/)라는 게임을 재밌게 한 기억이 났고, 이것처럼 만들어봐야겠다고 결심했다.

크리스마스까지 시간이 많지 않았기 때문에 기획, 디자인, 개발을 모두 동시에 했다. (그러지 말았어야 했다! 개발하다가 갑자기 생각이 바뀌어 코드를 완전히 새로 짜거나 새로운 그림을 그려야 하는 상황이 여러번 발생했다.) 프로젝트 중간에 친구가 게임 OST까지 작곡해줬는데, 게임 분위기와 놀랍도록 잘 맞아 떨어져서 신의 한 수였던 것 같다.

### 확장 불가능한 아이템 코드

플레이어는 루돌프나 요정을 고용해서 선물을 생산하도록 할 수 있다. 게임 특성상 '구입할 수 있는 아이템'과 '아직 구입할 수 없는 아이템'이 나뉘어 있고, 특정 조건을 만족하면 아이템의 잠금이 풀리는 매커니즘이 필요했다. 따라서 아이템 리스트를 먼저 만들었다.

```js
var htItem = [{
    k_name : "루돌프",
    name : "dolf",
    img : "img/dolf.gif",
    num : 0,
    prod : 2,
    addi : 1,
    cost : 30,
    lv : false
}, {
    k_name : "인턴 요정",
    name : "elf",
    img : "img/elf.gif",
    num : 0,
    prod : 5,
    addi : 2,
    cost : 200,
    lv : false
}, {
    // ...
```

이때는 왠지 몰라도 배열에 객체담는 걸 그렇게 좋아했다. 쉽게 파악하기 힘든 프로퍼티는 둘째치고, 가장 큰 문제는 아이템을 오직 인덱스로 관리했다는 점이다. 플레이어가 가진 선물에 따라 n번째 아이템을 구입할 수 있도록 열고, 아이템 리스트에서 n번째 요소를 클릭하면 `htItem[n]` 아이템이 구입되는 방식이었다.

어떤 아이템이 몇 번째 순서인지 기억해야 했고, `htItem` 중간에 새로운 아이템을 끼워 넣을 수 없었다. 이 때문에 '루돌프'와 '인턴 요정' 사이에 들어갈 '알바요정'의 그래픽 작업을 마쳤음에도 끝내 추가하지 못했다.

### 스파게티 주도 개발

아이템 관련 코드도 심각했지만, 정책 부분은 더 심각했다. 플레이어가 정책 리스트에서 정책을 구입하면 그 정책이 가진 효과를 실행해야 하는데, 그 부분을 이렇게 처리했다:

```js
// 정책 선택에 따른 분기를 설정, 처리한다.
function updatePolicy(sPolicy) {
    if(sPolicy == "practice") { // 리본묶기
        nClickPres = 1.2;
        renderPolicyList(1);
    } else if(sPolicy == "smart-work") { // 스마트 업무 환경
        nClickPres = 1.5;
        renderPolicyList(2);
    } else if(sPolicy == "night") { // 야근문화
        htItem[0]["prod"] += 1;
        $("#dolf .pr").text(htItem[0]["addi"] + " ~ " + htItem[0]["prod"] + "개 생산");
        renderPolicyList(3); // 열정페이 오픈
        renderPolicyList(4); // 멀티태스킹 오픈
    } else if(sPolicy == "pashion") { // 열정페이
        // ...
```

지옥이 있다면 이런 모습일까? 정책 리스트도 아이템처럼 객체 배열로 구성했지만, 정책마다 실행할 코드가 다르다는 점과 한 정책이 다음 정책을 여러 개 열 수 있다는 점이 아이템과는 달랐다. 가령 '리본묶기' 정책을 구입하면 선물 상자를 클릭할 때 들어오는 선물이 1.2개가 되고, 다음 정책인 '스마트 업무 환경'이 열린다. 반면 '야근문화'를 구입하면 루돌프(`htItem[0]`이 루돌프를 의미하는 게 포인트.)의 최대 생산량이 1오르고, '열정페이'와 '멀티태스킹'이 열린다.

중간에 새로운 정책을 끼워 넣을 수 없을 뿐만 아니라, 정책이 열리는 순서와 각 정책의 인덱스, 효과, 이름을 모두 숙지해야 했다. 솔직히 이 부분에서 때려칠까 고민했다.

### 그리고...

크리스마스 직전, 친구들에게 무작위로 링크를 뿌려 베타테스트를 했다. 아이템이나 정책 추가는 불가능했고, 버그 수정과 밸런싱에 신경썼다. [중년기사 김봉식](https://play.google.com/store/apps/details?id=com.maf.moneyhero&hl=ko)이라는 방치형 게임을 참고해 밸런스를 맞췄지만, 막상 테스트를 해보니 손볼 곳이 많았다.

이런 식의 스파게티 코드들을 `santa.js`에 때려 박았다. 어찌저치 런칭하기 했지만 당연히 유지보수가 불가능에 가까웠고, 게임 후반부에 게임이 멈춰버린다는 리포트도 많았다. 루돌프와 요정을 착취하려 했으나 결과적으로 내가 나를 착취한 상황이 됐다. 이후로 업데이트는 커녕 소스파일을 다시 열어보는 일도 없...을 줄 알았으나...

## 🌏 세계를 선도하는 글로벌 기업 (주)산타

2018년초 깃랩 프로젝트 몇 개를 깃허브로 옮기는 작업을 했다. 이때 Santa Inc. 코드를 다시 열어봤는데, 정말 '내 인생에 이딴 코드를 남겨두는 건 부끄러운 일이다'라는 생각이 들어 바로 뜯어 고치기 시작했다. 이때가 1월이었으니 크리스마스까지 시간은 충분했다.

### 모든 것을 모듈화하자

게임에 등장하는 주요 요소는 크게 두 가지, 직원과 정책이다. 먼저 `Worker` 클래스를 추상 클래스로 활용하면서 이를 `Rudolph`나 `InternElf`와 같은 각각의 직원 클래스에 상속했다. ES6 덕분에 클래스 문법에 따라 개발할 수 있었다.

```js
class Worker {
  static cost = 0;
  static minOutput = 0;
  static maxOutput = 0;

  constructor() {
    this.output = 0;
    this.level = 1;
    // ...
    this.img = '';
  }

  static getMinOutput() {
    return this.minOutput;
  }

  static getMaxOutput() {
    return this.maxOutput;
  }

  // ...

  next() {
    throw new Error('next() must be implemented.');
  }
}

export default Worker;
```

코드가 너무 길어 많은 부분이 생략되었지만, 대략 이런 모습이다. 다른 OOP 언어와 비슷하게 클래스 문법을 사용할 수 있다. 다만 추상 메소드라는 개념이 없어서 `next` 메소드는 서브클래스에서 구현되어야 한다는 에러를 던지도록 했다.

그리고 각 직원 클래스들이 `Worker`를 상속받는다.

```js
class Rudolph extends Worker {
  static cost = 1;
  static minOutput = 1;
  static maxOutput = 2;

  constructor() {
    super();

    this.name = 'rudolph';
    this.korName = '루돌프';

    this.img = '/assets/rudolph.gif';
  }

  next() {
    return new ParttimeElf();
  }
}

export default Rudolph;
```

`Rudolph` 인스턴스를 통해 `next`를 호출하면 다음 단계 직원인 알바요정(`ParttimeElf`)을 반환받는다. 이렇게 모든 종류의 직원을 각각의 클래스로 나눠서 관리하니 훨씬 편하게 개발할 수 있었다. 정책도 같은 방식으로 구현했다.

'감독관 배치' 정책은 모든 직원의 생산량을 1늘려준다. 이 동작도 다른 모듈은 전혀 건드리지 않고 감독관 배치 클래스에서 아주 간단하게 구현할 수 있다.

```js
class Supervisor extends Policy {
  // ...
  static execute() {
    const workers = Game.getHiredWorkers();

    workers.forEach((worker) => {
      worker.setOutput(worker.getOutput() + 1);
      PersonnelInterface.updateOutput(worker.getName(), worker.getOutput());
      Game.addTotalOutput(1);
    });
  }
}
```

`Supervisor.execute()`와 같이 호출되면 고용된 직원 객체로 구성된 배열을 가져와 각 직원의 `setOutput` 메소드를 호출해 생산량을 1씩 증가시킨다. 그리고 스크린의 사이드바에 있는 '인사 탭'을 업데이트하기 위해 `PersonnelInterface`의 `updateOutput` 메소드를 사용했다.

이로써 직원과 정책, 인터페이스가 완전히 독립적으로 동작하며 public 메소드를 통해 최소한의 관계를 유지할 수 있게 되었다. (자바스크립트에선 모든 프로퍼티가 public하지만...) 예전 방식대로라면 if문 지옥안에서 이중루프를 돌리는 짓을 했을지도 모른다.

### 타입스크립트로 마이그레이션

아무리 ES6라도 자바 프로그래밍에서의 개발 경험에 비하면 불편한 점이 많았다. abstract나 interface같은 OOP 문법이 없다는 건 둘째치고, 다양한 클래스를 다루다보니 원시 타입만 생각할 수가 없다는 게 큰 문제였다. Worker 타입, Policy 타입 등이 마구 섞이기 시작했다. 여기에 더해 인스턴스 멤버의 자동 완성이 제대로 안 된다는 불편함도 있었다.

타입 문제, 역시 타입스크립트가 바로 떠올랐다. 기존 자바스크립트 코드를 타입스크립트로 그대로 옮기는 작업이 크게 어려울 것 같지는 않았다. 바로 새로운 브랜치를 만들어 타입스크립트로 마이그레이션하는 작업을 시작했다.

```ts
abstract class Worker {
  protected static cost: number = 0;
  protected static minOutput: number = 0;
  protected static maxOutput: number = 0;

  protected output: number;
  protected level: number;
  protected levelCost: number;
  // ...
  protected img: string;

  constructor() {
    this.output = 0;
    this.level = 1;
    this.levelCost = 0;
    // ...
    this.img = '';
  }

  static getMinOutput(): number {
    return this.minOutput;
  }

  static getMaxOutput(): number {
    return this.maxOutput;
  }

  // ...

  abstract next(): Worker;
}

export default Worker;
```

기존 코드와 거의 비슷하다! 타입스크립트는 public, private, protected와 같은 접근 제한자를 제공한다. public은 외부에서 해당 클래스의 멤버에 직접 접근할 수 있고, private은 해당 클래스 내부에서만 접근할 수 있다. 그리고 protected는 해당 클래스와 그 서브클래스에서만 접근 할 수 있다.

`Worker`의 프로퍼티들을 protected로 설정해 `Worker`의 서브클래스에서만 프로퍼티에 직접 접근할 수 있도록 제한했다. 이 프로퍼티들은 오직 getter, setter 메소드를 통해서만 접근할 수 있다.

추상 클래스와 추상 메소드도 만들 수도 있다. `Worker` 클래스를 추상 클래스로 만들어 `new Worker()`처럼 생성하지 못하도록 했다. 또한 앞서 직접 에러를 던져주던 `next` 메소드도 추상 메소드로 만들었다. 이제 서브클래스에서 `next`를 오버라이드하지 않으면 타입스크립트 컴파일러가 알아서 잡아낸다.

대체로 자바 문법과 굉장히 비슷하다는 느낌을 받았다.

## 📌 코딩말고 다른 작업들

프로그래밍뿐 아니라 기획과 그래픽도 중요한 작업이었다.

### 마우스로 도트찍기

![알바요정.](/images/169650973-688ef6f9-c55c-437a-8b19-3a6d1d4b33f8.gif)

도트그래픽 외에는 선택지가 없었다. 다행인 것은 내가 도트그래픽을 좋아하고, 도트를 찍는 것도 좋아한다는 것이었다. 마우스로 열심히 도트를 찍어 프레임 포함 30개 정도의 어셋을 만들었다. 이 중에는 인게임에 적용된 것도 있고, 안타깝게 적용되지 못한 것도 있다. 빈 교실에서 눈오는 창밖을 보며 도트찍던(...) 그때가 생각난다.

### 사라진 콘텐츠와 추가된 콘텐츠

사실 Santa Inc.는 2015년 사회 이슈를 풍자하기 위해 만들었던 게임이었다. 당시에는 한창 열정페이나 노동개혁에 대한 논의가 활발했고, [Molleindustria](http://www.molleindustria.org/)처럼 사회적 메시지를 담은 결과물을 만들고 싶었다. 그래서 첫 버전에는 플레이어가 악덕 정책을 다수 채택하는 후반부에 요정들이 노조를 결성해 파업에 돌입하고, 회사가 감시, 소송 절차를 거치며 노조를 파괴하는 시나리오까지 있었다.

게임을 다시 만든 2018년에 똑같은 요소를 넣기엔 시의에 맞지 않았다. 노동 이슈를 그대로 다루되, 몇가지 정책을 빼고 이를 대체하는 다른 정책들을 추가했다. 기존의 해고 탭도 인사 탭으로 바꿔 직원을 승진시키는 기능을 더했다.

기존에 직원으로 있던 '커플'도 뺐다. 예전에는 크리스마스마다 커플을 밈으로 사용하는 한국 전통(?)에 따라 커플을 직원으로 넣었으나, 지금 보니 별로 적절하지 않았다. 캐릭터에 젠더 고정관념이 그대로 반영되기도 했고, 최근에는 그런 밈이 거의 사라진 것 같다. 대신 그 자리에 '트리'를 추가했다. 크리스마스하면 트리인데 왜 진작에 안 넣었는지 모르겠다.

'아이들'도 빼려 했다. 아이들을 위해 선물을 주는 산타가 아동노동을 자행하는 모습을 통해 블랙기업 산타 주식회사의 정체성을 좀 더 명확히 하려는 의도였는데, 마음이 아파서 아이들은 고용하지 않았다는 말을 듣고 이번에는 없애려 했...으나 모 회사에서 심야 업무에 불법적으로 청소년 노동자를 동원했다는 뉴스가 나와 다시 넣게 되었다.

추가로, 예전에 추가하지 못했던 비운의 알바요정을 루돌프와 인턴요정 사이에 넣었다.

## 🤔 그런 짓은 하지 말아야 했는데

제이쿼리를 버리고 싶었지만 처음 만들 때 제이쿼리로 만들었더니 뒤바꾸는 게 쉽지 않았다. 아예 웹 게임 엔진을 쓰면 좋은데, 로직을 고치는 것만으로도 벅차서 이 부분은 잘 신경쓰지 못했다.

일단 로직과 html 코드 조각이 마구 섞여있는 게 신경쓰였다. 리액트에서 컴포넌트를 관리하는 것처럼 요소별로 모듈을 분리하면 어떨까 싶어서 시도해봤다.

```ts
const WorkerItem = (
  name: string,
  img: string,
  korName: string,
  cost: number,
  minOutput: number,
  maxOutput: number
) => {
  return (
    `<li id="${name}">` +
      `<img class="worker-img" src="${img}"/>` +
      `<p>${korName}` +
        '<img class="item-present-img" src="./assets/present.png">' +
        `<span class="t">${cost}</span>` +
        `<br/><span class="pr">${minOutput} ~ ${maxOutput}개 생산</span>` +
      '</p>' +
    '</li>'
  );
};

export default WorkerItem;
```

직원 목록의 각 아이템을 컴포넌트로 만들었다. 이제 필요한 곳에서 불러와 파라미터를 잘 넣어주면 된다.

```ts
import WorkerItem from './WorkerItem';
// ...
drawWorkerList(worker: Worker): void {
  // ...
  this.elements.workerList.append(
    WorkerItem(
      worker.getName(),
      worker.getImg(),
      worker.getKorName(),
      workerClass.getCost(),
      workerClass.getMinOutput(),
      workerClass.getMaxOutput()
    )
  );
  // ...
```

파라미터도 많고 관심사의 분리도 완벽하지 않아서 여전히 마음에 안 들지만, 그래도 로직과 뒤섞여 있는 것보다는 조금 나아졌다. 분명 제이쿼리 장인들은 더 나은 방법을 썼을 것 같은데 잘 모르겠다.

평소 게임 개발쪽은 큰 관심이 없음에도 주기적으로 게임을 만들어지고 싶어지는 시기가 온다. 다음에는 아예 (예전에 파다가 관둔) 유니티를 공부해서 만들어볼까한다.

Santa Inc.의 코드는 [GitHub 저장소](https://github.com/ParkSB/santa-inc)에서 살펴볼 수 있다.
