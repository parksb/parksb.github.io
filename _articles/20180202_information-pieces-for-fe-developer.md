---
id: 0
title: "📋 프론트엔드 개발자를 위한 토막상식"
subtitle: ""
date: "2018.02.02"
---

프로젝트하면서 알게 된 것들과 코딩테스트를 통해 배운 것들, 자바스크립트&제이쿼리: 인터랙티브 프론트엔드 웹 개발 교과서(Jon Duckett)와 JavaScript: The Good Parts(Douglas Crockford)를 통해 공부한 것들, 그리고 [Front-end Job Interview Questions](https://github.com/h5bp/Front-end-Developer-Interview-Questions)에 나와있는 질문들에 대한 대답을 간략하게 정리했다.

## 일반적인 것들

### 헝가리안 표기법

변수 이름에 데이터 타입을 접두어로 붙이는 표기법이다. 숫자라면 `nVar`, 배열이라면 `aVar` 이런 식으로 붙인다. 2015년 네이버에서 인턴십을 할 때 코딩컨벤션이 헝가리언 표기법 + 캐멀케이스여서 그때 처음 접하고 사용하기 시작했는데, 요즘에는 헝가리언 표기법을 지양한다고 한다. 가독성과 유지보수 효율성이 떨어진다고. ([참고](https://stackoverflow.com/questions/111933/why-shouldnt-i-use-hungarian-notation))

### 블록 안에서 변수 선언

Java의 경우 한 블록 안에서만 쓰이는 변수를 코드 위쪽에 선언하지 않고 블록 안에 변수를 선언하면 코드를 파악하기 더욱 쉬워지고, 스코프를 제한할 수 있어 안전하다. 자바스크립트의 `var`타입은 블록 스코프가 아닌 함수 스코프를 적용하기 때문에 어디에 선언하든 아무런 차이가 없다. 하지만 `let`이나 `const`를 사용한다면 얘기가 달라진다. 이 둘은 블록 스코프이다. ([참고](https://stackoverflow.com/questions/3684923/javascript-variables-declare-outside-or-inside-loop))

### 점진적 향상법(Progressive enhancement)과 우아한 성능저하법(Graceful degradation)

사용자가 항상 최신 기술을 사용할 수 있는 환경에서 서비스를 사용하지는 않는다. 특히 웹사이트를 만들 때는 최신 브라우저와 구식 브라우저를 모두 신경써야 한다. 점진적 향상법과 우아한 성능저하법은 최신과 구식에 대응하기 위한 방법을 말한다. ([참고](http://www.clearboth.org/51_graceful_degradation_versus_progressive_enhancement/))

점진적 향상법은 기본적으로 구식 기술 환경에서 동작할 수 있는 기능을 구현하고, 최신 기술을 사용할 수 있는 환경에서는 더 나은 사용자 경험을 제공할 수 있는 최신 기술을 제공하는 방법이다. 즉, 구식 환경에서도 충분히 서비스를 사용할 수 있고, 최신 환경이라면 더 나은 기능들을 사용할 수 있도록 만드는 것이다. 구식 브라우저를 사용하는 사용자에게 100만큼의 기능을 제공하고, 최신 브라우저를 사용하는 사용자에게는 130정도의 기능을 제공하도록 웹사이트를 만든다고 보면 된다.

우아한 성능저하법은 점진적 향상법과 반대이다. 이는 최신 기술을 기반으로 기능을 구현한 뒤, 구형 기술에 기반한 환경에서도 유사하게 동작하도록 만드는 방법이다. 최신 브라우저에서는 100만큼의 기능을 제공하고, 구식 브라우저에서는 50정도의 기능만을 제공하게 웹사이트를 만드는 것이다. img 태그에 alt 속성을 지정함으로써 이미지를 보여주지 못하는 환경에서 이미지를 텍스트로 대체하는 것이 대표적인 예시다.

### FOUC(Flash Of Unstyled Content)

FOUC는 외부의 CSS 코드를 불러오기 전 스타일이 적용되지 않은 페이지가 잠시 나타나는 현상이다. 특히 IE에서 자주 발생하는 현상으로, 사옹자 경험을 저하하는 요인이 된다. FOUC가 발생하는 이유는 브라우저가 마크업에 참조된 파일들을 모아 DOM을 생성할 때 가장 빠르게 분석할 수 있는 부분(HTML)을 먼저 화면에 표시한 뒤, 화면에 출력된 마크업 순서에 따라 스타일(CSS)을 적용하고 스크립트(Javascript)를 실행하기 때문이다.

FOUC를 해결하기 위해서는 head 태그 안에 CSS를 링크하고, `@import`의 사용을 자제해야 한다. 또한 자바스크립트를 head 태그 안에서 로드하는 것도 방법될 수 있다. (하지만 별로 추천하지 않는다.) 어떤 방법으로도 해결되지 않는다면 FOUC가 발생하는 구역을 숨겼다가 브라우저가 준비됐을 때 다시 보여주는 방법이 있다. ([참고](http://webdir.tistory.com/416))

### ARIA(Accessible Rich Internet Applications)와 스크린리더

ARIA는 접근가능한 인터넷 어플리케이션을 의미한다. 이는 웹 콘텐츠를 개발할 때 장애인을 위한 접근성 향상 방법을 정의한다. ARIA를 사용해 웹사이트여러 곳의 접근성을 향상할 수 있다. ARIA는 `<html>` 태그에 `role` 속성을 지정하는 방식으로 사용할 수 있으며, 대부분의 브라우저와 스크린리더가 ARIA를 지원하고 있다. 스크린리더는 웹사이트의 구성 요소들을 읽어주는 프로그램으로, 시각장애를 가진 사용자가 컴퓨터 화면에 무엇이 있는지 인지할 수 있게 돕는다. ([참고](https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA))

### CSS 애니메이션과 Javascript 애니메이션의 차이

자바스크립트는 메인 쓰레드가 무거운 작업을 하고 있을 때 애니메이션 처리의 우선순위를 미뤄두는 반면 CSS는 독립적인 쓰레드가 애니메이션을 처리해준다. 때문에 CSS 애니메이션은 최적화가 쉽다. 하지만 항상 CSS 애니메이션이 우수한 것은 아니다. UI 요소가 작은 경우 CSS를 사용하고, 애니메이션을 세밀하게 제어해야 하는 경우 자바스크립트를 사용하는 것이 좋다. ([참고1](https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy)) ([참고2](https://brunch.co.kr/@99-life/2))

### 동일출처정책(Same-origin policy)과 CORS(Cross-origin resource sharing)

동일출처정책은 한 출처의 문서가 다른 출처의 문서와 상호작용하지 못하도록하는 정책이다. 두 문서의 프로토콜, 포트, 호스트가 같으면 동일출처라고 한다. CORS는 어떤 웹페이지에 있는 자바스크립트가 해당 도메인이 아닌 다른 도메인에 XMLHttpRequests 요청을 허용하는 기법을 말한다. 브라우저는 서버와 통신할 때마다 서로에 대한 정보를 HTTP 헤더를 이용해 전달한다. CORS는 HTTP 헤더에 정보를 추가해 브라우저와 서버가 서로 통신해야 한다는 사실을 알게 한다. CORS를 통하지 않을 경우, Cross-domain 요청은 동일출처정책에 의해 브라우저가 금지한다. CORS는 다른 출처에서 온 요청을 허용할 지 결정하기 위해 브라우저와 서버가 상호교류하는 방법을 정의한 것이다. CORS는 W3C 명세에 포함되어 있지만 IE의 경우에는 비표준 XDomainRequest 객체를 사용하여 CORS 요청을 처리한다. ([참고1](https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy)) ([참고2](http://www.internetmap.kr/entry/Crossorigin-resource-sharing))

### 코드 의존성과 DRY원칙

어떤 스크립트는 다른 추가적인 스크립트를 필요로 하기도 한다. 이때 다른 스크립트에 의존하는 스크립트를 작성할 때 해당 스크립트에 의존성이 있다고 표현한다. jQuery를 활용하는 스크립트는 의존성이 있다고 할 수 있다. 이런 경우 주석을 통해 의존성을 명시하는 것이 좋다.

DRY원칙은 Don't Repeat Yourself의 줄임말로, 소프트웨어 개발 원칙을 말한다. 한국어로는 중복배제라고 한다. 같은 작업을 수행하는 코드를 두 번 작성했다는 이를 코드 중복이라고 하는데, DRY원칙은 이러한 코드 중복을 지양하자는 원칙이다. 코드 중복의 반대 개념으로는 코드 재사용(Code reuse)이 있다. 코드 재사용은 같은 코드가 스크립트의 다른 곳에서 한 번 이상 사용되는 것을 말한다. 함수를 활용하는 것은 코드 재사용의 좋은 예로, 재사용 가능한 함수를 헬퍼 함수(Helper function)라고 한다. 코드 재사용을 권장하기 위해 개발자들은 작은 스크립트를 작성하는데, 이때문에 코드 재사용은 코드 사이에 더 많은 의존성을 만든다.

## HTML

### DOCTYPE

DOCTYPE은 문서형을 말하며, 해당 문서가 어떤 버전의 어떤 마크업 언어로 구성되어있는지를 의미한다. DOCTYPE을 선언하는 것을 DTD(Dodumenttation Type Declaration)라고 한다. DTD는 각 마크업의 각 버전에서 사용가능한 태그나 속성 등을 정의하기 때문에 문서의 최상단에 위치해야 한다. HTML5 이전 버전은 SGML(Standard Generalized Markup Language)에 기반했기 때문에 DTD 참조가 필수적이었다. HTML5는 DTD 참조가 필요하지 않으며, 하위 호환을 위해 `<!DOCTYPE html>`만으로 선언한다. ([참고](http://webdir.tistory.com/40))

### 표준모드(Standard mode)와 호환모드(Quirks mode)

표준모드와 호환모드는 브라우저가 가진 두 가지 렌더링 모드다. 브라우저는 DTD에 따라 렌더링할 모드를 선택하는데, 이 과정을 Doctype sniffing또는 Doctype switching이라고 한다. 브라우저가 출력하고자 하는 문서가 최신이라면 W3C나 IETF의 표준을 엄격히 준수하는 표준모드로 렌더링을 한다. 반면 문서가 오래된 버전이라면 호환모드로 렌더링한다. 호환모드는 이전 세대의 브라우저에 맞는 비표준 규칙을 문서에 적용해 오래된 웹페이지들이 최신 브라우저에서 깨져보이지 않게 한다. 브라우저는 문서가 최신인지 아닌지를 DTD로 판단한다. 만약 DTD가 존재하지 않거나 일부가 누락된 경우 호환모드로 문서를 해석한다. 또한 IE의 경우 DTD 앞에 주석이나 다른 문자가 들어갔을 때도 문서를 호환모드로 해석한다. ([참고](https://developer.mozilla.org/ko/docs/Web/HTML/Quirks_Mode_and_Standards_Mode))

### XML과 XHTML

XML과 XHTML모두 웹 문서 규격이다. XML은 W3C에서 여러 특수 목적의 마크업 언어를 만드는 용도에서 권장되는 다목적 마크업 언어다. XML은 문서 상의 데이터 이름과 값 등을 구분하기 위해 만들어졌는데, XML은 SGML(참고로 SGML은 인터넷이 등장하기 이전에 만들어졌다.)을 기반으로한 HTML의 한계를 극복하여 XHTML을 이끌었다. XML을 기반으로 한 HTML을 만든 셈이다. XHTML은 XML의 문법을 따르며, HTML 문법과 매우 유사하지만 더 엄격하다.

XHTML이 더 표준인 것처럼 보이지만 사실 그렇게 권장하지 않는 사람들도 있다. 일단 HTML의 호환성이 더 높기 때문이다. XHTML은 1.1버전부터 비표준이나 비권장 태그를 호환하지 못하게 되면서 지나치게 엄격하다는는 비판을 받았다. IE가 XHTML을 해석하지 못하는 것 역시 XHTML의 호환성을 떨어뜨리는 요인이 됐다. 또한 XHTML과 HTML의 요소와 속성에는 차이가 거의 없다. 단지 HTML에서는 `<br>`로 써도 되지만 XHTML에서는 반드시 `<br/>`로 써야한다는 정도의 문법이 다를 뿐이다. 이런 점에서 굳이 XHTML을 써야할 기술적 이유는 없다는 것이다. 한편 HTML5가 발표되면서 XHTML은 거의 사용되지 않고 있다. ([참고](http://blog.wystan.net/2007/05/24/xhtml-vs-html))

### data-* 속성

HTML5에서 새로 추가된 data- _속성은 커스텀 데이터 속성으로, 개발자가 임의로 이름을 붙일 수 있는 속성이다. data-_ 속성은 `<html>` 태그 상에서 별다른 작용을 하지 않는다. 자바스크립트가 DOM의 데이터에 접근하거나 서버에서 받아온 데이터를 활용해야 할 때 사용된다. ([참고](https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/data-*))

### Cookie, sessionStorage, localStorage

쿠키(Cookie), 세션 저장소(sessionStorage), 로컬 저장소(localStorage)는 브라우저에 데이터를 저장하기 위한 공간들이다. HTML5 이전에는 쿠키를 주로 사용했다. 하지만 쿠키는 많은 양의 데이터를 저장할 수 없고, 동일한 도메인에 페이지를 요청할 때마다 서버로 함께 전송되며, 변조가 쉬워 보안이 취약해진다. 그래서 HTML5부터는 저장소 객체(Storage object)를 정의하고 있다. 저장소 객체는 세션 저장소와 로컬 저장소 두 가지를 제공한다. 로컬 저장소에 데이터를 자장하면 창이나 탭을 닫아서 세션이 종료돼도 데이터가 보존되고, 열려 있는 모든 창이나 탭이 데이터를 공유하게 된다. 세션 저장소는 반대다. 일반적으로 브라우저는 저장소에 5mb 정도의 공간을 할당하며, 데이터는 키-값 쌍(KVP; Key-Value Pair)을 이용하는 저장소 객체의 속성으로 저장된다. 또한 브라우저는 데이터를 보호하기 위해 동일출처정책에 의거, 서로 다른 페이지는 같은 도메인에 저장된 데이터에만 접근이 가능하도록 제한하고 있다. ([참고1](https://developer.mozilla.org/ko/docs/Web/HTTP/Cookies)) ([참고2](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)) ([참고3](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage))

### script 태그의 async와 defer

`<script>` 태그에 `async` 속성과 `defer` 속성이 추가된 것은 HTML5부터다. 브라우저가 웹 문서에서 외부 스크립트를 불러오는 `<script>` 태그를 만나면 해당 스크립트를 내려받아 해석하고 실행할 때까지 HTML 코드 파싱 작업을 뒤로 미룬다. 그래서 무거운 스크립트 문서를 해석할 때는 페이지 전체가 느려지는 현상이 발생한다. 그런데 `<script>` 태그에 `async`나 `defer` 속성을 지정하면 마크업 코드 작업을 중단하지 않고 스크립트를 동시에 내려받게 된다. `defer`는 마크업 파싱을 마친 다음 스크립트를 실행하며, `async`는 스크립트를 내려받는 즉시 스크립트를 실행한다. ([참고](https://appletree.or.kr/blog/web-development/javascript/script-%ED%83%9C%EA%B7%B8%EC%9D%98-async%EC%99%80-defer-%EC%86%8D%EC%84%B1/))

### Progressive rendering

Progressive rendering은 콘텐츠를 빠르게 화면에 렌더링하는 기법이다. 브로드밴드 인터넷이 등장하기 전에 매우 중요한 기술이었고, 모바일 플랫폼을 고려한다면 여전히 무시할 수 없는 부분이다. 가시영역의 이미지만 로딩해주는 jQuery 플러그인 Lazy loading이 좋은 예다. ([참고](https://stackoverflow.com/questions/33651166/what-is-progressive-rendering))

## CSS

### Reset CSS

모든 브라우저에서 통일된 화면을 볼 수 있도록 CSS의 기본값을 초기화하는 것을 말한다. [Eric Meyer's Reset](https://meyerweb.com/eric/tools/css/reset/)과 [Normalize.css](https://necolas.github.io/normalize.css/)가 주로 쓰인다.

### BFC(Block Formatting Context)와 IFC(Inline Formatting Context)

모든 HTML 요소는 사각형 박스 형태를 취하고 있다. 박스는 Box-model이라는 모델을 가지고 있다. CSS요소에는 `display`가 존재하는데, 이는 블록(Block)과 인라인(Inline) 두 가지 값을 가질 수 있다. `block`은 블록 레벨 요소(Block-level elements)를 의미하며, 블록 레벨 요소는 BFC에 속하는 박스이다. 블록 레벨 요소 박스는 수직으로 계속 쌓인다. `inline`은 인라인 레벨 요소(Inline-level elements)를 의미한다. 인라인 레벨 요소는 인라인 레벨 박스를 생성하며, 이는 IFC에 속한다. 인라인 레벨 요소 박스는 수평으로 계속 쌓인다. 또한 인라인 레벨 박스에 `border`나 `padding`이 눈에 보이더라도 사실은 `line-height`에 의해 높이가 조절된다. `inline-block`은 특이한데, 이 요소는 인라인 요소처럼 수평으로 쌓이지만 블록 레벨 요소의 박스처럼 높이를 계산한다. 즉 `line-height`에 의존하지 않는다. ([참고](https://brunch.co.kr/@techhtml/21))

### 클리어링(Clearing) 기술

클리어링은 `float` 속성이 주변 요소의 배치에 영향을 미치지 않도록하는 것이다. `float` 속성을 가진 요소는 자신의 위치를 주변 콘텐츠로부터 상대적으로 배치하기 때문에 다른 콘텐츠가 그 주위로 흐르게 된다. 클리어링를 통해 이를 방지할 수 있는데, 여기에는 4가지 방법이 있다.

첫 번째는 `float`에 `float`으로 대응하는 것이다. 자식 요소 뿐만 아니라 부모 요소에게도 `float` 속성을 지정하면 부모 요소가 자식 요소의 높이를 반영한다. 단, 이렇게 하면 부모 요소의 너비가 자식 요소를 담을 정도로 줄어든다.

두 번째는 `float`에 `overflow` 속성으로 대응하는 것이다. 자식 요소의 높이를 부모에게 반영하는 방법으로, 부모 요소의 `overflow` 속성에 `auto` 또는 `hidden` 값을 부여한다. 하지만 `auto` 값의 경우 자식 요소가 부모 요소보다 클 때 스크롤바가 생기며, `hidden` 값의 경우 넘치는 부분이 잘려버린다.

세 번째로 `float`을 빈 엘리먼트로 클리어링할 수도 있다. `float`이 지정된 요소 뒤에 빈 요소를 추가하고 빈 요소의 `clear` 속성에 `both` 값을 부여하는 것인데, 의미없는 요소를 사용하게 되기 때문에 권장하지 않는다.

마지막으로 `float`을 가상 선택자 `:after`로 클리어링하는 방법이 있다. 가상 선택자는 가상 클래스(pseudo-class)와 가상 요소(pseudo-element)로 나뉜다. 가상 클래스는 특정 요소에 아무런 class를 부여하지 않았지만 마치 class를 변경한 것과 같은 역동적인 효과를 낼 수 있는 것들이다. `:hover`, `:active`, `:focus` 등이 여기에 속한다. 가상 요소는 존재하지 않는 요소를 가상으로 생성하는 선택자다. `:first-line`, `:before`, `:after`가 여기에 속한다. 가상 요소는 HTML 문서에 존재하지 않는 콘텐츠를 출력하기도 한다. 이렇게 가상 요소를 생성한 다음 `display: block; clear: both;` 처리를 하면 깔끔하게 클리어링을 할 수 있다. 가장 권장하는 방법이다.

### Image Replacement

요소를 이미지로 교체하는 기법이다. 기본적으로 다음과 같이 하면 된다:

```css
.elements {
  background-image: url("image.png");
}
```

그리고 [A History of CSS Image Replacement](https://www.sitepoint.com/css-image-replacement-text-indent-negative-margins-and-more/)에서 더 많은 예시를 볼 수 있다.

### IE box model과 W3C box model의 차이

브라우저에 따라 박스 모델이 달라 요소에 지정된 너비와 높이가 같아도 서로 다르게 렌더링된다. 박스 모델은 기본적으로 `margin`, `border`, `padding`, `content`로 구성되어 있다.

![두 박스 모델.](/images/cb8fdf6a-50b9-11e5-80f0-da960d3f88cc.gif)

W3C의 표준 박스 모델은 콘텐츠의 너비, 높이만을 `width`와 `height`로 계산하는 반면, IE의 박스 모델은 콘텐츠와 `padding`, `border`를 포함한 너비와 높이를 `width`, `height`로 계산한다. 이를 위한 해결책은 (1)DTD를 통해 브라우저가 쿽스 모드로 동작하지 않도록 하거나 (2)wrapper 요소를 사용해 wrapper 요소에 `width`, `height` 값을 할당하고 내부 엘리먼트에 `padding`, `border` 값을 할당하거나 (3)Conditional comment를 추가하거나 (3)css hack을 사용하는 방법이 있다. ([참고](https://github.com/nhnent/fe.javascript/wiki/%EB%B0%95%EC%8A%A4%EB%AA%A8%EB%8D%B8))

### 그리드 시스템 (Grid system)

반응형 웹페이지를 만들기 위해 자주 쓰이는 기술이다. 페이지 위에 격자를 그리고 그 위에 요소를 그 위에 배치하는 방법으로, 기술적인 이유만이 아니라 디자인적인 이유로도 사용한다. [그리드 레이아웃은 CSS를 이용해 만들 수 있다.](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Grid_Layout) 쉽게 그리드 시스템을 사용하기 위해서 [부트스트랩](http://bootstrapk.com/css/#grid)을 사용하기도 한다.

## CSS 전처리기

CSS 문서가 방대해짐에 따라 작업 효율을 높이기 위해 등장한 기술이다. 전처리기를 사용하면 CSS 상의 반복적인 부분을 스크립트나 변수로 처리할 수 있고, 다양한 연산이 가능해진다. [Less](http://lesscss.org/)나 [Sass](https://sass-lang.com/)가 대표적인 CSS 전처리기이다.

```less
@bgColor: #DFDFDF;
body {
  background-color: @bgColor;
}
```

위는 Less의 예시다. 컴파일을 하면 `body`의 `background-color` 값이 `#DFDFDF`로 치환된 CSS 코드를 얻을 수 있다.

### 반응형 디자인(Responsive design)과 적응형 디자인(Adaptive design)

반응형 디자인은 디스플레이의 너비에 따라 레이아웃을 변형시키고, 적응형 디자인은 고정적 레이아웃을 가진다. 반응형 웹이 미디어쿼리를 사용해 스타일 분기를 나누는 방법이라면 적응형 웹은 디바이스를 체크해 그 디바이스에 최적화된 마크업을 호출하는 방법이다. ([참고](https://studio-jt.co.kr/%EB%B0%98%EC%9D%91%ED%98%95-%EC%9B%B9-%EA%B7%B8%EB%A6%AC%EA%B3%A0-%EC%A0%81%EC%9D%91%ED%98%95-%EC%9B%B9/))

## Javascript

### 추상적 같음 비교(Abstract equality comparison)와 엄격한 같음 비교(Strict equality comparison)

추상적 같음 비교(`==`)는 두 변수를 같은 데이터 타입으로 변환한 다음 값을 비교하는 반면, 엄격한 같음 비교(`===`)는 두 변수의 값과 데이터 타입을 함께 비교한다. 따라서 값과 타입이 완전히 일치해야 `true`를 반환한다. 엄격한 같음 비교를 사용한 비교 결과는 예측이 쉽고 타입 강제가 일어나지 않기 때문에 추상적 같음 비교를 사용하는 것보다 낫다. ([참고](https://developer.mozilla.org/ko/docs/Web/JavaScript/Equality_comparisons_and_sameness))

### 고급 예외처리(Advanced exception handling)

`try...catch`와 `throw`로 고급 예외처리를 할 수 있다. 참고로 프로그램 실행 중에 발생하는 오류는 예외(Exception)이라고 하며, 코드의 문법적 오류는 에러(Error)라고 한다. `try...catch`는 구동 중 코드상에서 발생할 수 있는 오류들을 잡아준다.

```js
try {
  // try 블록은 예외가 발생할 수도 있는 부분
} catch(e) {
  // catch 블록은 try 블록에서 예외가 발생했을 때 호출되는 부분
  // 객체 e는 name과 message 속성을 가짐
} finally {
  // 선택적으로 finally 블록을 추가할 수 있음
  // 예외 발생 여부를 떠나 무조건 실행되어야 할 부분
}
```

`throw`문은 강제로 예외를 발생시킬 때 사용한다. `throw`의 문법은 다음과 같다:

```js
throw expression;
```

표현식의 값은 숫자, 문자 등 어떤 것이든 상관없다. `throw`가 발생하면 가장 가까운 `catch` 블록으로 이동한다. 다음과 같이 사용하면 된다:

```js
try {
  if(a > 100) {
    throw "Value too high";
  }
} catch(e) {
  alert(e);
}
```

([참고1](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#예외처리문)) ([참고2](http://webclub.tistory.com/71))

### Event delegation

이벤트 리스너를 등록하는 것은 DOM 입장에서는 부담스러운 일이며, 리소스를 상당히 잡아먹는 작업이다. 그래서 요소 하나하나에 이벤트를 등록하는 대신 위임을 하는 것이 바람직하다. 자식 요소들을 감싼 부모 요소에 이벤트를 등록해 이벤트를 위임하면 각각의 자식 요소들에 이벤트를 등록하는 효과를 낼 수 있다. 이벤트를 위임하면 리소스를 절약할 수 있을 뿐만 아니라 DOM 트리에 새로운 요소를 추가했을 때 코드를 추가할 필요가 없어지고, 코드의 양을 줄일 수도 있다. 다음은 ul 요소의 자식 요소인 li 요소를 클릭하면 해당 li 요소가 사라지는 코드이다.

```html
<ul id="todoList">
  <li>TODO: A</li>
  <li>TODO: B</li>
  <li>TODO: C</li>
</ul>
```

아주 평범한 리스트이다.

```js
function getTarget(e) {
  if(!e) { // event 객체가 존재하지 않으면
    e = window.event; // IE의 event 객체를 사용
  }

  return e.target || e.srcElement; // 이벤트가 발생한 요소를 가져옴
}

function itemDone(e) {
  var elTarget, elParent;

  elTarget = getTarget(e); // 이벤트가 발생한 요소 가져옴 (li)
  elParent = target.parentNode; // 해당 요소의 부모 요소를 가져옴 (ul)
  elParent.removeChild(elTarget); // 이벤트가 발생한 요소를 제거함 (li)
}

(function(){
  var el = document.getElementById('todoList');

  if(el.addEventListener) { // 이벤트 리스너가 지원되면
    el.addEventListener('click', function(e) { // 클릭 이벤트에 리스너를 지정
      itemDone(e);
    }, false); // 이벤트 버블링을 사용
  } else { // 이벤트 리스너가 지원되지 않으면
    el.attachEvent('onclick', function(e) { // IE의 onclick 이벤트를 사용
      itemDone(e);
    }
  });
})();
```

IE까지 고려한 코드다. 하나의 이벤트 리스너로 요소 3개를 제어하고 있다다. jQuery는 보다 편하게 이벤트를 바인딩할 수 있도록 [`.delegate()`](http://api.jquery.com/delegate/) 메소드를 제공하고 있다.

### Prototype 기반 상속

자바스크립트는 클래스라는 개념이 없기 때문에 프로토타입(Prototype)이 클래스를 대신해 객체지향 프로그래밍의 핵심을 맡는다. 다만 ES6부터 클래스 문법이 추가됐기 때문에 프로토타입에 직접 접근할 필요가 없어졌다. [자바스크립트의 OOP는 진정한 OOP가 아닌가?](https://parksb.github.io/article/1.html)를 참고해보자. 그래도 프토로타입은 여전히 자바스크립트의 기반이기 때문에 알아두는 것이 좋다. 자바스크립트에서는 이 프로토타입을 통해 다른 객체지향 언어에서 쓰이는 클래스를 구현할 수 있다.

```js
function Player() {
  this.hp = 100;
  this.mp = 50;
}

var kim = new Player();
var park = new Player();

console.log(kim.hp); // 100
console.log(kim.mp); // 50

console.log(park.hp); // 100
console.log(park.mp); // 50
```

`kim`과 `park`은 `hp`와 `mp`를 각각 100, 50씩 가지고 있다. 만약 객체를 100개 만들면 200개의 변수가 메모리에 할당된다. 프로토타입을 활용하면 메모리를 아낄 수 있다.

```js
function Player() {}
Player.prototype.hp = 100;
Player.prototype.mp = 50;

var kim = new Player();
var park = new Player();
```

`kim`과 `park`은 프로토타입에 연결된 `Player` 객체의 값을 가져다 쓸 수 있다. `hp`와 `mp`를 `kim`과 `park`이 공유하는 것이다. 이러한 매커니즘으로 프로토타입을 이용해 상속을 구현할 수 있다. ([참고1](https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67)) ([참고2](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain))

### null, undefined, undeclared의 차이

이건 종종 헷갈리는 경우가 있다. `null`은 어떠한 값도 가리키지 않는다는 의미의 원시값이다. 변수를 선언하고 `null`을 할당한 경우 해당 변수가 어떠한 값도 가지지 않았다는 의미가 된다. `undefined`는 변수가 선언됐지만 값이 할당되지 않았다는 것을 의미하는 값이다. 즉, `null`은 개발자로부터 할당되는 값이고, `undefined`는 아예 할당을 하지 않은 상태다. `undeclared`는 변수 자체가 선언되지 않았다는 의미다. 콘솔에서는 `undefined`와 똑같이 표기되기 때문에 변수가 초기화되지 않았다는 것인지, 아예 선언되지 않았다는 것인지 확인할 필요가 있다.

### 클로저(Closure)

자바스크립트에서는 함수 안에 또 다른 함수를 선언할 수 있는데, 함수 안의 함수인 내부함수(inner function)는 외부함수(outer function)의 지역변수에 접근할 수 있다. 외부함수의 실행이 끝나서 외부함수가 소멸된 이후에도 내부함수는 외부함수에 접근할 수 있다. 이러한 메커니즘을 클로저라고 한다. MDN에 클로저를 활용한 재밌는 예제가 있다:

```js
function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

여기서 `makeAdder(x)`는 `x`를 인자로 받아서 새로운 함수를 반환한다. 그리고 반환되는 내부 함수는 `y`를 인자로 받아 `x + y`를 반환한다. ([참고1](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Closures)) ([참고2](https://opentutorials.org/course/743/6544))

### 자바스크립트 모듈 패턴(Module pattern)

모듈 패턴(Module pattern)은 코드 설계 방법을 말한다. 여기서는 객체를 public과 private으로 나누는 캡슐화가 핵심이다. 자바스크립트는 public이나 private와 같은 접근 제한자를 제공하지 않지만, 클로저를 이용해 구현할 수 있다. private method는 코드 접근을 제한할 수 있을뿐만 아니라 추가적인 자바스크립트가 다른 스크립트와 이름이 충돌하는 것을 막을 수 있다. 매우 기본적인 방법은 모든 코드를 익명함수 안에 집어넣어 private 스코프로 만드는 것이다. 하지만 이렇게 하면 코드를 재사용하기 불편해지기 때문에 별도의 네임스페이스를 적용해야 한다. ([참고1](http://asfirstalways.tistory.com/234))

### 네이티브 객체(Native object), 호스트 객체(Host object), Built-in 객체

객체는 크게 3가지로 구분된다. 네이티브 객체는 ECMAScript 명세에 정의된 객체로, 자바스크립트의 모든 엔진에 구현된 표준객체이다. BOM(Browser Object Model)과 DOM 등은 모두 네이티브 객체며, 자바스크립트 엔진을 구동하는 측에서 빌드되는 객체이다. 호스트 객체는 개발자가 정의한 객체이다. 마지막으로 Built-in 객체는 자바스크립트 엔진을 구성하는 기본 객체들을 포함한다. `Number`, `String`, `Array`, `Date` 등의 내장객체들이 있다. ([참고](https://github.com/hckoo/javascriptstudy2013/blob/master/1209/6%EC%9E%A5%20%EA%B0%9D%EC%B2%B4.md))

### 기능 검출(Feature detection)과 기능 추론(Feature inference)

기능 검출이란 스크립트가 호출하는 기능을 사용자의 브라우저가 지원하는지 체크하는 것을 말한다. 다음은 브라우저가 GPS를 지원하는지 확인하는 코드다.

```js
if(navigator.geolocation) {...}
```

기능 추론도 기능 검출처럼 브라우저가 특정 기능을 지원하는지 체크하는 것이다. 하지만 'A기능을 지원하면 B기능도 지원할 것이다.'라는 추론이 바탕이 된다. 별로 좋지 않은 방법이다. ([참고](https://stackoverflow.com/questions/20104930/whats-the-difference-between-feature-detection-feature-inference-and-using-th))

### 호이스팅(Hoisting)

호이스팅은 인터프리터가 스크립트를 해석할 때, 변수의 정의가 스코프에 따라 선언과 할당으로 분리되어 선언을 항상 컨텍스트의 최상위로 끌어올리는 것을 의미한다. 즉, 변수를 어디에서 선언하든 인터프리터는 최상단에서 선언한 것으로 해석한다. 이는 변수 뿐 아니라 함수에도 적용된다. 따라서 상단에서 함수를 호출하고, 하단에서 함수를 정의해도 기능적인 문제는 없다. ([참고](https://stackoverflow.com/questions/20104930/whats-the-difference-between-feature-detection-feature-inference-and-using-th))

### 이벤트 흐름(Event flow)

HTML 요소가 다른 요소의 내부에 중첩되어 있을 때 자식 요소를 클릭하면 부모 요소를 클릭한 셈이 된다. 이처럼 이벤트는 흐름을 가지고 있으며, 이것을 이벤트 흐름이라고 부른다. 이벤트 흐름에는 두 가지 방식이 있다. 먼저 이벤트 버블링(Event bubbling)은 이벤트가 직접적으로 발생한 노드로부터 시작해 바깥 노드로 이벤트가 퍼져 나가는 방식을 말한다. 대부분의 브라우저가 기본적으로 이 방식을 지원한다. 반대로 이벤트 캡쳐링(Event capturing)은 바깥 노드부터 시작해서 안쪽으로 퍼지는 방식이다. IE8 혹은 그 이전 버전에서는 지원되지 않는다.

### document load event와 DOMContentLoaded event

DOM을 제어하는 스크립트는 마크업의 모든 요소에 대한 처리가 끝난 뒤에 로드되어야 한다. 그래서 보통 `<body>` 태그 최하단에서 스크립트를 불러오도록한다. 또 다른 방법은 이벤트를 이용하는 것이다. document load event는 페이지의 모든 리소스가 로드된 이후에 실행된다. 때문에 구동이 지연되어 사용자 경험을 저하할 수 있다. 반면 DOMContentLoaded event는 스크립트 로드를 마치고 실행이 가능한 시점에 바로 실행된다. ([참고](https://opentutorials.org/module/904/6765))

### 조건부 삼항 연산자(Conditional ternary operator)

보통 그냥 '삼항 연산자'이라고 부른다. if문을 축약해서 쓸 수 있는 유용한 연산자이지만, 과하게 사용하면 코드의 가독성을 떨어뜨릴 수 있다.

```js
var a = 1, b = 2;

console.log(a < b ? "True" : "False"); // "True"
console.log(a > b ? "True" : "False"); // "False"

a < b ? (
  console.log("True");
  alert("True");
) : (
  console.log("False");
  alert("False");
); // "True"
```

조건이 `true`면 전자의 값을 반환하고, `false`면 후자의 값을 반환한다.

### use strict

ES6에서 새로 추가된 기능으로, 스크립트에 `"use strict;"` 구문을 추가하면 strict mode에서 실행하게 된다. strict mode는 코딩 실수를 찾아 예외를 발생시키고, 전역 객체에 접근하는 것과 같은 위험한 액션을 막는다. 스크립트 전체에 적용할 수도 있고 특정 함수에만 적용할 수도 있다. ([참고](https://stackoverflow.com/questions/1335851/what-does-use-strict-do-in-javascript-and-what-is-the-reasoning-behind-it))

### Call stack과 Task queue

자바스크립트 엔진은 요청이 들어올 때마다 요청을 순차적으로 call stack에 담아 하나씩 처리한다. call stack은 하나만 존재하기 때문에 요청도 하나씩만 처리할 수 밖에 없다. task queue는 처리해야 하는 task를 임시로 저장해두는 큐다. call stack이 비워지면 task queue에 있던 task들이 순서대로 call stack에 push된다. 가령 `setTimeout()` 함수로 10초의 딜레이를 둔다면, 그동안 `setTimeout()`이 처리할 task는 task queue에 쌓이고 다른 부분의 스크립트들이 실행된다. 따라서 딜레이를 0으로 줘도 `setTimeout()`의 task는 다른 것들보다 나중에 처리된다. ([참고](https://github.com/nhnent/fe.javascript/wiki/June-13-June-17,-2016))
