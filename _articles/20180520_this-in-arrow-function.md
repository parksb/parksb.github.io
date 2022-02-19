---
id: 14
title: "ES6 화살표 함수의 this에 관하여"
subtitle: ""
date: "2018.05.20"
---

동아리 웹 세미나 중 jQuery를 이용해서 요소를 클릭하면 요소의 내용이 바뀌는 예제를 시연했다.

```js
$('#el').on('click', function() {
  $(this).html('clicked!');
});
```

물론 잘 된다. 그런데 개발환경을 설명하는 부분에서 npm과 babel까지 설치하고 ES6로 같은 예제를 돌렸는데 왠지 작동하지 않았다.

```js
import $ from 'jquery';
$('#el').on('click', () => {
  $(this).html('clicked!');
});
```

뭔가 webpack에서 설정을 잘못해서 서버에 반영이 되지 않는 상황인줄 알고 일단 넘어갔다. 그런데 지금 생각해보니 결정적인 부분에서 실수한 것이었다. **화살표 함수에서 `this`는 스스로를 가리키지 않는다.** 대신 외부 컨텍스트의 `this`값이 적용된다.

화살표 함수가 없던 구버전 ECMAScript에서는 외부 컨텍스트의 `this`에 접근하려면 별도의 변수를 만들어야했다. ([MDN 화살표 함수 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/%EC%95%A0%EB%A1%9C%EC%9A%B0_%ED%8E%91%EC%85%98#%EB%B0%94%EC%9D%B8%EB%94%A9_%EB%90%98%EC%A7%80_%EC%95%8A%EC%9D%80_this)를 인용했다.)

```js
function Person() {
  var that = this;  
  that.age = 0;

  setInterval(function growUp() {
    that.age++;
  }, 1000);
}
```

외부 컨텍스트 `Person`의 `age`에 접근하기 위해 `that`이라는 변수를 사용했다. 하지만 화살표 함수를 쓴다면?

```js
function Person() {
  this.age = 0;

  setInterval(() => {
    this.age++;
  }, 1000);
}
```

`this`가 `Person` 객체를 참조하기 때문에 바로 `age`에 접근할 수 있다. `that` 같은 변수는 필요하지 않다.

그렇다면 클릭 이벤트는 어떻게 처리해야 할까?

```js
import $ from 'jquery';
$('#el').on('click', (e) => {
  $(e.currentTarget).html('clicked!');
});
```

jQuery에서는 `currentTarget`이라는 속성을 제공한다. 클릭 이벤트가 발생했을 때 이벤트 객체 `e`의 `currentTarget`에 접근하면 클릭된 요소를 조작할 수 있다.
