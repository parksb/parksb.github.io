---
id: 34
title: "🗞️ 훈련소에서 매일 뉴스 받아보기"
subtitle: "고립된 훈련병을 위한 종합 뉴스"
date: "2019.09.30"
---

훈련소에서 가장 답답한 것은 외부와의 단절이라는 말을 자주 들었다. 그래서 입대한 친구들에게 뉴스나 읽을거리를 요약해서 인터넷 편지로 보내주곤 했는데, 매일 주요 뉴스를 요약하는 것은 의외로 손이 많이 가는 일이었다. 무엇보다 인터넷 편지 발송을 지원하는 서비스인 [더 캠프](http://thecamp.or.kr/)의 인터페이스가 너무 불편해서 사용하기 쉽지 않았다.

그러던 중 나에게도 군사교육 소집 통지서가 왔고, 4주간의 고립은 역시 중대한 문제였다. 그렇게 입소를 앞둔 일요일, 매일 인터넷 편지로 뉴스를 보내주는 프로그램을 만들게 됐다.

## 더 캠프 라이브러리

훈련병에게 편지를 보내려면 반드시 더 캠프를 거쳐야 한다. 더 캠프가 오픈 API를 지원하면 참 좋겠지만 안타깝게도 그렇지 않았다. 결국 클라이언트에서 HTTP 요청을 구성해 직접 더 캠프 서버로 보내는 방식으로 구현했다.

프로젝트 구조는 간단히 계획했다. `src` 디렉토리 하위의 `models` 디렉토리에 각종 인터페이스를 두고, `services` 디렉토리에는 실제 요청을 보내고 값을 얻는 함수들을 모은다. `utils` 디렉토리에는 여러 서비스에서 반복적으로 사용되는 함수를 두기로 했다.

```
.
+- examples
+- src
|  +- models
|  +- services
|  +- utils
+- test
```

구체적으로 어디로 요청을 보내야 하는지 알아내기 위해 훈련소에 있는 지인(정확히는 친구의 학교 후배였다.)에게 인터넷 편지를 발송하고 브라우저의 개발자 도구에서 네트워크 로그를 확인했다.

![개발자 도구 네트워크 패널.](/images/65763301-0810b980-e15e-11e9-9ca1-16a6178ca466.webp)

`https://www.thecamp.or.kr/pcws/message/letter/insert.do`에 요청을 보내면 된다는 것을 알게 됐다. 요청 본문에는 `unit_code`, `group_id` 등 알 수 없는 키들이 있었고, [포스트맨](https://www.getpostman.com/)으로 테스트한 요청에는 로그인 정보를 찾을 수 없다는 응답이 돌아왔다.

로그인에 대한 응답 헤더를 살펴보니 `JSESSIONID`와 `SCOUTER` 쿠키가 있었다. HTTP는 무상태(Stateless) 프로토콜이기 때문에 독립적인 쌍의 요청과 응답으로 연결이 끊긴다.[^mdn] 로그인한 사용자를 식별하기 위해서는 세션 정보를 유지해야 하는데, 톰캣 서버는 이를 위해 `JSESSIONID`와 `SCOUTER` 쿠키를 사용한다. 쿠키는 클라이언트단에 저장되는 데이터이기 때문에 값을 유지할 수 있으며, 요청 헤더에 쿠키를 포함하면 세션을 식별하는 것이 가능하다.

서버측에서 요청을 비동기적으로 처리하기 때문에 [request-promise](https://github.com/request/request-promise)를 사용하여 세션 쿠키를 얻어오는 로그인 함수를 작성했다. 이때는 단순하게 쿠키를 반환하는 걸로 끝냈는데, 지금 생각해보면 세션 인스턴스의 프로퍼티로 할당해서 다른 서비스에서 바로 사용하도록 만들면 더 편했을 것 같다.

```ts
interface Cookie {
  scouter: string;
  jsessionid: string;
}
```

```ts
async function login(id: string, password: string) {
  let result: Cookie | null = null;
  const options = {
    uri: buildRequestUrl('common/login.do'),
    method: 'POST',
    json: true,
    body: {
      'user-id': id,
      'user-pwd': password,
      subsType: 1,
    },
  };

  await requestPromise.post(options, (err, res, body) => {
    // ...
  });

  return result as Cookie;
}
```

이어서 사용자가 가입한 카페 중에서 편지를 받을 훈련병이 속한 카페를 찾아야한다. 만약 훈련병이 25연대 5중대에 속해있다면 더 캠프에서 25연대 5중대 카페에 가입하고, 이 카페에서 편지를 보내는 방식이다.

카페 리스트 요청 헤더를 통해 앞서 본 `unit_code`와 `group_id`는 각각 연대/사단 식별 코드, 카페 아이디라는 것을 알게 됐다. 그리고 위와 같은 방식으로 인터페이스와 함수를 만들었다. 헤더에 로그인으로 얻은 세션 쿠키를 담아 요청을 보내면 사용자가 가입한 카페 리스트를 가져온다. 훈련병의 소속과 입소 날짜를 파라미터로 넘겨주면 해당 훈련병이 속한 카페만 탐색해 반환한다.

```ts
interface Group {
  unitName: string; // 연대/사단 이름
  fullName: string; // 카페 전체 이름
  enterDate: string; // 훈련병 입소 날짜 (YYYYMMDD)
  groupId: string; // 카페 식별 코드
  groupName: string; // 카페 이름
  groupImage: string; // 카페 대표 이미지
  accessDate: string; // 요청 날짜
  unitCode: string; // 연대/사단 식별 코드
  unitType: number; // 육군훈련소(1)/사단신교대(2) 여부
  grade: number;
}
```

```ts
async function fetchGroups(cookies: Cookie, unitName?: string, enterDate?: string) {
  // ...
  return result as Group[];
}
```

응답이 스네이크 케이스(snake_case)로 떨어지지만 코드의 캐멀 케이스(camelCase)를 포기하고 싶지 않았다. 때문에 응답을 위한 별도의 인터페이스를 만들었는데, 손이 많이 가지는 않지만 소모적인 일이었다. 뭔가 매핑해주는 툴이 있으면 좋겠다는 생각이 들었다.

```ts
interface GroupResponse {
  unit_name: string;
  full_name: string;
  enter_date: string;
  group_id: string;
  group_name: string;
  group_image: string;
  access_date: string;
  unit_code: string;
  unit_type: number;
  grade: number;
}
```

실제 편지 전송은 간단했다. 훈련병의 이름, 생년월일, 훈련병과의 관계 정보와 함께 앞서 얻은 카페 정보들을 담아 요청을 보내면 인터넷 편지가 발송됐다.

이렇게 [the-camp-lib](https://github.com/ParkSB/the-camp-lib)를 '소기의 목적 달성을 위한 최소한의 수준'까지 만들어 npm 패키지로 배포했다.

## 훈련병을 위한 데일리 뉴스

인터넷 편지 내용은 다음뉴스의 RSS를 이용해 구성했다. 인터넷 편지의 글자 제한이 2000자이기 때문에 최대한 경제적으로 내용을 구성해야 했다. 먼저 기사의 첫 문장만 잘라냈다.

```ts
content = content.slice(0, content.indexOf('다.') + 1);
```

그리고 기사 앞에 붙는 바이라인과 불필요한 문구를 지웠다.

```ts
content = content.replace(/^(\*그림\d\*)?(\(|\[|【)\s?.*=.*\s?(\)|\]|】)\s?/, '')
  .replace(/^[가-힣]{2,4}\s(기자|특파원)\s=\s/, '');
```

`npm install the-camp-lib`으로 앞서 만든 패키지를 설치하고, 실제 편지를 보내는 코드를 작성했다.

```ts
async function setMessage() {
  // ...
}

(async () => {
  // ...

  const cookie = await thecamp.login(id, password);
  const [group] = await thecamp.fetchGroups(cookie, unitName, enterDate);

  const trainee = {

    traineeName,
    unitCode: group.unitCode,
    groupId: group.groupId,
    relationship: thecamp.Relationship.FATHER,
  };

  const date = new Date();
  const message = {
    title: `${date.getMonth()}월 ${date.getDate()}일 (${date.getHours()}시 ${date.getMinutes()}분) - 다음뉴스 종합`,
    content: (await setMessage()),
  };

  await thecamp.sendMessage(cookie, trainee, message);
})();
```

훈련병의 이름이나 생년월일, 소속 등 훈련병에 대한 사전 정보는 `.env` 파일을 이용해 관리했다. 입소 전에는 소속을 알 수 없기 때문에 친구에게 나중에 소속이 나오면 값을 넣어달라고 부탁해뒀다. 편지를 보내는 계정은 아버지의 계정을 사용했다. 내가 나에게 편지를 보내도 될 것 같기는 하지만, 만에 하나 훈련소에 들어가서 문제가 생기면 디버깅을 할 수 없기 때문에 최대한 안전한 방법을 택해야 했다.

그렇게 만든 파일을 개인 서버에 올리고, 크론(Cron)을 이용해 하루 두 번씩 파일을 실행하도록 했다.

```
0 0 * * * cd ~/projects/daily-news-for-trainee && ts-node index.ts
0 18 * * * cd ~/projects/daily-news-for-trainee && ts-node index.ts
```

편지를 두 번이나 보낸 이유는 더 많은 뉴스를 받기 위함이기도 하고, 한 번만 보내면 인편이 누락될 수 있다는 이야기를 들었기 때문이기도 하다. 하필 0시, 18시인 이유는 딱히 없었다. 나중에야 알게 됐지만, 편지를 나눠주는 시간이 대체로 17시 전이라서 18시는 좋은 선택이 아니었다.

[daily-news-for-trainee](https://github.com/ParkSB/daily-news-for-trainee)까지 완성하며 훈련소에 들어가기 전 할 수 있는 일은 모두 끝마쳤다.

## 실행

8월 29일 논산 육군훈련소에 입소했다. 프로그램에 문제가 있어도 고칠 수 없는 상황이다보니 뉴스가 안 올까봐 불안해하며 일주일을 보냈다. 일주일 뒤 인사담당 훈련병들이 인터넷 편지를 나눠주기 시작했고, 성공적으로 뉴스가 도착했다!

![인터넷 편지.](/images/65825439-dc9ee380-e2b1-11e9-8610-b4cae8efbb5a.jpg)

덕분에 매일 두 통씩 뉴스를 받아보며 바깥 소식을 알 수 있었다. 입소 바로 전날 밤에 예상치 못한 문제가 생겨서 `node_modules` 디렉토리의 트랜스파일된 자바스크립트 코드를 직접 수정하는 짓까지 했는데, 다행히 잘 동작했다.

몇 가지 실수한 것이 있다면 날짜가 0월부터 시작해서 제목의 날짜가 9월이 아니라 8월로 찍혀나왔다는 점, 불필요한 문구를 삭제하는 정규표현식을 잘못 작성하여 기사의 일부까지 날려버리는 경우가 있었다는 점이다.

또한 일반적으로 기사의 첫 문장은 제목을 그대로 반복하기 때문에 첫 문장을 보여주는건 내용 파악에 큰 도움이 되지 않았다. 가령 "14호 태풍 '가지키' 베트남 다낭서 소멸" 기사의 첫 문장은 "베트남 다낭 부근에서 발생한 제 14호 태풍 '가지키'가 에너지를 잃고 소멸됐다"가 되는 식이다. 종합 뉴스라서 관심이 없는 뉴스가 많았던 것도 아쉬웠다. 섹션별로 뉴스를 따로 보냈으면 더 좋았을 것 같다. 우리 분대원들은 주로 연예 뉴스를 원했는데, 종합에는 연예 뉴스가 들어가는 일이 없었다.

결정적으로 매일오는 뉴스보다 사람이 보낸 편지가 훨씬 좋았다. 편지를 받았는데 뉴스면 실망감이 더 크다.

그래도 극도로 제한적인 환경에서 나의 문제를 해결해본 경험이 꽤 재밌었다. 개발할 수 있는 시간이 많지 않아서 더 재밌던 것 같기도 하다. 이번에 직접 찾아낸 문제들을 개선해 나중에 입대하는 친구에겐 더 나은 뉴스를 보내줘야겠다.

[^mdn]: MDN web docs, "[An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview#HTTP_is_stateless_but_not_sessionless)", 2019.
