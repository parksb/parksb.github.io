---
id: 37
title: "읽기 쉬운 웹을 위한 타이포그래피"
subtitle: "조판 원칙으로 가독성 높이기"
date: "2021.01.13"
---

웹에서 장문의 글을 보여줄 때 보다 읽기 쉽게 디자인하기 위한 원칙을 소개하고자 한다. 전통적인 타이포그래피 규칙들을 바탕으로 웹에서 글을 어떻게 효과적으로 조판할지 소개하되, 활자 자체를 해부하지는 않는다. 이 글에서 제시하는 원칙을 무조건적으로 따르는 것보다는 상황에 따라 유연하게 적용하는 것이 좋고, 실험적인 시도를 원한다면 안 따르는 것이 낫다.

## 폰트

먼저 폰트에 대한 용어를 정리할 필요가 있다. 타이포그래피의 많은 부분이 과거 금속 활자를 조판하던 과정에서 유래되었기 때문에 배경을 알면 이해하기 수월하다. 가령 대문자를 'Uppercase'라고 일컫는 이유는 대문자 금속 활자를 위쪽에 있는 서랍(Case)에 보관했기 때문이고, 소문자를 'Lowercase'라고 일컫는 이유는 소문자 금속 활자를 아래쪽에 있는 서랍에 보관했기 때문이다.

폰트(Font)는 각각의 크기와 무게, 스타일로 이뤄진 활자 집합을 의미한다. 폰트 패밀리(Font family, 활자가족)는 유사한 특성을 공유하지만 다양한 시각적 변화를 지닌 폰트의 집합이다. 한편 타입페이스(Typeface, 활자꼴)는 폰트와 비슷하지만, 활자의 시각적 속성만을 의미한다.[^00] 예를들어 'Helvetica' 타입페이스의 폰트 패밀리에는 'Helvetica Roman', 'Helvetica Bold', 'Helvetica Italic' 등이 포함되어있다. 'Helvetica Roman 10pt'와 'Helvetica Roman 12pt', 'Helvetica Bold 10pt', 'Helvetica Italic 10pt'는 모두 다른 폰트다.

![헬베티카의 폰트 패밀리.](/images/103456120-964af680-4d36-11eb-9d15-7f97e83f08aa.webp)

오늘날에는 모든 것이 폰트로 통용된다. 일반적으로 'Helvetica Roman 10pt'와 'Helvetica Roman 12pt'가 다른 폰트라고 생각하는 사람은 거의 없다. 금속 활자를 조판할 때는 'Helvetica Roman 10pt', 'Helvetica Roman 12pt', 'Helvetica Bold 10pt'에 모두 다른 금속 활자를 사용해야 한다. 이때는 폰트와 폰트 패밀리, 타입페이스의 구분이 명확하다. 반면 디지털 환경에서는 활자의 크기와 무게, 스타일을 쉽게 바꿀 수 있기 때문에 그 경계가 흐려진다. 워드에서 'Arial'을 'Helvetica'로 바꿀 때 우리는 "타입페이스를 바꾼다"라고 말하기 보다는 "폰트를 바꾼다"라고 말한다.[^10] 이 글에서는 디지털 환경에서 일반적으로 사용하는 용어로써의 '폰트'를 사용할 것이고, 폰트 패밀리는 CSS 속성 `font-family`를 지칭하는 용어로만 사용할 것이다.

### 파일

주로 많이 사용하는 폰트 파일 형식에는 TTF, OTF, WOFF, WOFF2가 있다. TTF(TrueType)는 전통적, 범용적으로 사용되어 온 포맷이다. OTF(OpenType)는 TTF를 확장한 포맷이기 때문에 TTF 보다 많은 정보를 담을 수 있다.[^13] 가장 큰 차이는 TTF는 2차원 베지어 곡선으로, OTF는 3차원 베지어 곡선으로 활자를 표현한다는 점이다. 그래서 일반 문서에는 TTF를, 고해상도 그래픽 작업에는 OTF를 사용하는 것이 일반적이다. WOFF(Web Open Font Format)는 웹에서 폰트를 사용하기 위해 만들어진 포맷으로, TTF, OTF 등 기존 포맷들을 압축한 것이다. 압축되어 있기 때문에 웹에서 빠르게 로드된다.[^15] WOFF2는 WOFF를 개선해 압축률을 높인 버전이다. 폰트 파일의 크기가 크다면 웹 페이지를 로드할 때 병목으로 작용할 수 있으므로, 웹에서 폰트를 사용할 때는 WOFF2, WOFF, TTF/OTF 순으로 적용하는 것을 권장한다.

```css
@font-face {
  font-family: 'Noto Sans';
  font-weight: 400;
  src: local('Noto Sans Regular'),
  url('/font/Noto-Sans-Regular.woff2') format('woff2'),
  url('/font/Noto-Sans-Regular.woff') format('woff'),
  url('/font/Noto-Sans-Regular.ttf') format('truetype');
  font-display: swap;
}

.element {
  font-family: 'Noto Sans', sans-serif;
}
```

위처럼 `@font-face`를 작성하면 가장 먼저 로컬에서 'Noto Sans Regular' 적용을 시도한다. 만약 로컬에 폰트가 없어서 적용에 실패하면 웹에서 `/font/Noto-Sans-Regular.woff2`를 요청해 다운로드하고, 적용을 시도한다. WOFF2 폰트 적용도 실패하면 순서대로 WOFF, TTF 적용을 시도한다.

`font-display` 속성은 폰트를 다운로드하고 사용할 때 어떻게 표시할지 결정한다. 이 값을 `swap`으로 설정하면 요청한 폰트가 로드되지 않은 경우 대체 폰트를 렌더링하고, 이후 요청한 폰트가 로드됐을 때 빠르게 교체한다.[^17]

한글 폰트 파일은 영문 폰트에 비해 크기때문에 성능을 저하할 수 있다. 폰트가 모든 현대 한글을 표현하려면 초성 19자와 중성 21자, 종성 27자를 조합한 11,172자가 필요하다. ASCII 코드가 128자만으로 A부터 Z까지의 영문, 심지어 일부 특수문자까지 지원하는 것과는 상반된다. 컴퓨터에서 한글을 표현하는 문제는 1974년으로 거슬러 올라간다. 당시 정부는 한글 51자모를 ASCII 코드에 일대일 대응해 KS C 5601-1974 규격을 제정했고, 1987년에는 자주 사용되는 한글 2,350자를 추려내 KS C 5601-1987 규격을 제정했다. 한글 완성형 코드의 최신 버전은 국가기술표준원이 표준화한 KS X 1001-2004으로, 일반적으로 디자이너가 한글 폰트를 디자인할 때는 한글 11,172자를 모두 디자인하지 않고 KS X 1001-2004에 포함된 2,350자만을 디자인한다.

다만 [Noto](https://fonts.google.com/noto)처럼 한글 11,172자를 모두 정의해둔 한글 폰트도 있다. 한글 뿐만 아니라 한자, 가나(仮名), 잘 사용하지 않는 특수문자까지 포함된 폰트라면 파일 크기가 매우 커질 수 있다. 이때는 원본 폰트에서 사용할 문자만을 골라내 서브셋(Subset)을 만들면 파일 크기를 줄일 수 있다. 가령 [akngs/noto-kr-vf-distilled](https://github.com/akngs/noto-kr-vf-distilled) 프로젝트는 Noto Sans에서 ASCII 코드에 포함된 문자 95자와 KS X 1001의 한글 2,350자, "KS 코드 완성형 한글의 추가 글자 제안"[^18]에서 제안된 한글 228자만을 포함한 Noto 서브셋을 가변 폰트로 제공한다.

### 패밀리

좋은 폰트를 사용하는 것만으로도 심미성과 가독성, 판독성을 어느정도 얻을 수 있다. 폰트의 종류는 일반적으로 5개, 12개 정도로 구분하며, CSS의 `font-family` 속성에는 6가지의 `generic-name` 값을 사용할 수 있다. 아래와 같이 값을 설정하면 가장 먼저 'Helvetica' 적용을 시도하고, 해당 폰트가 없으면 두 번째로 'Noto Sans' 적용을 시도한다. 두 번째도 실패하면 기본값으로 설정되어 있는 산세리프 폰트를 적용한다.

```css
font-family: 'Helvetica', 'Noto Sans', sans-serif;
```

본문에 가장 많이 사용되는 유형은 세리프(`serif`)체와 산세리프(`sans-serif`)체일 것이다. 세리프는 글자 획의 삐침을 가리킨다. 이는 끌로 석판을 조각하던 고대의 조판 방식에서 유래했다. 산세리프는 '~없는'이라는 뜻의 프랑스어 `sans`와 세리프가 합쳐진 단어로, 세리프가 없는 폰트를 산세리프체라고 한다.

![세리프체와 산세리프체의 차이. 가독성엔 큰 차이가 없다.](/images/103481426-519a8a80-4e1e-11eb-97d4-5a82675880c0.webp)

본문 폰트로 세리프체의 가독성이 더 좋은지, 산세리프체의 가독성이 더 좋은지에 대해서는 다양한 의견이 있다. 이론적으로 세리프체는 수평 흐름을 만들기 때문에 읽기 수월하지만, 사실 독자가 폰트에 얼마나 익숙한지가 더욱 중요하다.[^20] 이미 웹에서는 본문에 산세리프체를 널리 사용해 왔기 때문에 가독성에는 큰 영향을 끼치지 않는다.

프로그래머라면 세리프체와 산세리프체만큼 고정폭(`monospace`) 폰트를 자주 사용한다. 코드에 고정폭 폰트를 사용하는 것은 당연한 일이고, 본문에 숫자를 혼용할때도 숫자에 고정폭 폰트가 적용되도록 하는 것이 좋다. 오픈타입 폰트를 사용한다면 `font-variant-numeric` 속성을 이용해 숫자에만 고정폭을 적용할 수 있다.

```css
font-variant-numeric: tabular-nums;
```

스포카에서 만든 [스포카 한 산스 네오](https://spoqa.github.io/spoqa-han-sans/)의 경우 폰트 자체가 숫자 가독성을 높이도록 디자인되어 있다. 본문에 혼용된 외국어나 숫자, 부호 등에 각기 다른 스타일을 적용하기 위한 [multilingual.js](https://multilingualjs.github.io/) 같은 라이브러리도 있다.[^25]

## 위계

요소 사이 위계가 잘 잡혀있으면 구조를 파악하기 쉽다. 하나의 책은 대단원, 중단원, 소단원으로 위계를 이룰 수 있고, 하나의 글은 제목, 부제목, 본문 등으로 위계를 이룰 수 있다. 내용상의 위계가 제대로 전달되려면 시각적인 위계가 필요하다. 시각적인 위계는 기본적으로 요소의 무게로 만들 수 있으며, 시각적인 무게는 요소와 요소 사이의 간격, 요소의 크기와 농도, 색깔, 위치, 정렬 등을 종합하여 만들 수 있다. 간격과 정렬에 대해서는 별도의 문단에서 설명할 것이고, 여기에서는 크기와 굵기, 농도에 대해서만 설명한다.

![크기와 무게에 따라 위계가 만들어진다.](/images/103536441-ddbbb900-4ed5-11eb-974a-03cb29cd8a7f.webp)

### 크기

활자의 크기는 가장 직관적으로 받아들이고, 만들 수 있는 무게다. `font-size` 속성에 다양한 단위로 값을 부여해 설정할 수 있다.

픽셀(`px`)은 고정적인 단위다. 디스플레이 크기에 상관없이 `1px`은 항상 `1px`이다. 폰트 크기를 픽셀로 정의하면 다양한 디스플레이에 대응하기 어렵고, 접근성이 떨어지는 문제가 있다. 일부 브라우저에서는 폰트 크기를 키우지 못하기 때문이다.[^27] 포인트(`pt`) 단위는 주로 인쇄물에 사용한다. 포인트 역시 픽셀과 마찬가지로 고정적인 단위다.

`em`은 대문자 'M'의 너비를 기준으로한 상대적인 단위다. `1em`은 요소 자신의 `font-size` 값이다. `font-size` 속성은 상속되기 때문에 상위 요소의 값을 따르게 된다. 상속 값이 없다면 브라우저 기본값을 따른다.

```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1em; /* 16px */
}
```

`rem`은 'root em'이다. `em`과 비슷하지만, `1rem`은 자신이나 상위 요소의 `font-size`가 아닌 루트 요소의 `font-size` 값이다. 일반적으로 HTML 문서의 루트 요소는 `html`이므로 `html` 요소의 `font-size` 값이 기준이 된다.

```css
html {
  font-size: 16px;
}

.child {
  font-size: 1em; /* 16px */
}
```

위계 관계에 있는 요소 사이의 크기 격차는 눈에 띄어야 한다. `20px` 제목과 `18px` 본문은 분명히 수치적인 크기의 차이가 있지만, 눈으로는 쉽게 위계를 구분할 수 없다.

### 무게

굵기와 농도는 폰트의 무게에 큰 영향을 준다. 폰트는 굵기가 굵을수록, 농도가 높을수록 무거워지며, 무거워질수록 위계가 높아지는 효과가 있다.

폰트의 굵기를 정하는 `font-weight` 속성의 값은 `normal`, `bold`와 같이 설정할 수도 있고, 부모 요소에 상대적인 값인 `lighter`와 `bolder`를 사용할 수도 있다. 좀 더 정밀하게 굵기를 다루려면 `100`, `200`, `300`부터 `900`까지의 가중치를 직접 설정하면 된다.

```css
font-weight: 100; /* Thin */
font-weight: 200; /* Extra Light */
font-weight: 300; /* Light */
font-weight: 400; /* Normal (normal)*/
font-weight: 500; /* Medium */
font-weight: 600; /* Semi Bold */
font-weight: 700; /* Bold (bold) */
font-weight: 800; /* Extra Bold */
font-weight: 900; /* Black */
```

앞서 언급했듯이 농도가 높을수록 요소가 무거워지고, 낮을수록 가벼워진다. 농도가 너무 낮아 배경과의 대비가 미미해지면 가독성과 접근성이 떨어지는 문제가 발생할 수 있으므로 주의해야 한다. 아래 두 텍스트는 크기와 굵기가 동일하지만 농도로 인해 위계를 이룬다.

![농도가 높을수록 무거워진다.](/images/103541449-c92fee80-4ede-11eb-8b4c-66be64aa97f0.webp)

위계를 만들 때는 어떤 요소의 우선순위가 높은지 골라내고, 어떤 요소를 강조할 것인지 잘 선택해야 한다. 모든 요소가 중요하다는 것은 어떤 요소도 중요하지 않다는 의미로 받아들여질 수 있다.

## 글자사이, 낱말사이

활자와 활자 사이의 간격을 글자사이 또는 자간(Letterspace), 단어와 단어 사이의 간격을 낱말사이 또는 어간(Wordspace)이라고 한다. 인쇄 조판을 할 때는 활자 하나하나, 단어 하나하나의 자간과 어간을 조정하는 일이 잦다. 의도적으로 자간을 조정하는 것을 커닝(Kerning)이라고 한다.

하지만 웹에서 자간을 일일히 조정하는 것은 쉽지 않다. 다행히 `font-kerning` 속성을 사용하면 브라우저가 폰트에 담긴 커닝 정보를 사용하도록 할 수 있다.

```css
font-kerning: normal;
```

자간과 어간을 직접 설정하고 싶다면 `letter-spacing` 속성과 `word-spacing` 속성을 사용하면 된다.

```css
letter-spacing: 3px;
word-spacing: 2px;
```

많은 폰트들이 합자(Ligature)를 가지고 있다. `ff`, `fi`, `fl` 등 두 개 이상의 활자를 연이어 사용할 때 조형적으로 부자연스러운 형태가 나타나기도 한다. 이런 경우 연속적인 활자들을 하나의 활자 형태로 만들 수 있다.

![ff, fi, fl, ffi, ffl](/images/103481091-d59f4300-4e1b-11eb-8582-92d9105762dc.webp)

`font-variant-ligatures` 속성으로 합자를 항상 활성화하거나 비활성화하도록 강제할 수 있다.

```css
font-variant-ligatures: normal;
font-variant-ligatures: no-common-ligatures;
font-variant-ligatures: common-ligatures;
```

`no-common-ligatures` 속성은 합자를 비활성화하고, `common-ligatures` 속성은 합자를 활성화한다.[^28] `text-rendering` 속성도 합자에 영향을 준다.

```css
text-rendering: auto;
text-rendering: optimizeSpeed;
text-rendering: optimizeLegibility;
text-rendering: geometricPrecision;
```

`optimizeSpeed` 값은 렌더링 성능을 최적화하여 합자와 커닝을 비활성화한다. `optimizeLegibility` 값은 반대로 판독성을 최적화하며, `geometricPrecision` 값은 속도나 판독성이 아닌 정밀성을 최적화한다.[^29]

대체로 합자는 연이어진 활자들과 비슷한 형태의 한 덩어리로 이뤄지지만, 완전히 다른 형태가 되는 경우도 존재한다. 가령 `>=`을 $\geq$ 합자로 치환하는 폰트들이 있다. 이런 합자는 가독성과 심미성을 높여주지만, 편집이 빈번히 일어나는 경우에는 방해가 될 수 있다. $\geq$에서 백스페이스를 눌러 한 자를 지웠을 때 `=`이 지워지고 `>`만 남을 것이라는 것을 예측할 수 없기 때문이다.

## 글줄사이

글줄과 글줄 사이 간격을 글줄사이 또는 행간(Linespace)이라고 한다. 의도적으로 행간을 조정하는 것은 레딩(Leading)이라고 한다. 행간이 너무 좁으면 독자가 같은 줄을 여러 번 읽는 실수를 한다.

![기본 행간과 1.5 행간 비교. 1.5 행간의 가독성이 더 높다.](/images/103455164-f38e7a00-4d2d-11eb-966f-fdeeb77aa66d.webp)

행간은 `line-height` 속성으로 설정할 수 있다. 유저 에이전트마다 기본값이 다른데, 데스크탑 브라우저의 경우 `1.2`정도로 설정된다. 가독성과 접근성을 위해서 본문 행간은 최소 `1.5` 이상으로 설정하는 것이 좋다. 행간을 적절히 넓게 하면 저시력자 또는 난독증을 가진 사용자의 사용 경험을 높일 수 있고[^30], 활자의 크기가 작을 때도 읽기 쉬워진다.

특히 행간을 넓게 했을 때 좋은 폰트 유형이 있다. x-height이 큰 폰트를 사용할 때는 글줄이 서로 가까워 보이기 때문에 행간을 넓게 잡아야 한다. (x-height은 소문자 'x'의 높이를 의미한다.) 수직 스트레스가 강한 폰트를 사용할 때는 수평 강세를 유지하기 위해 행간을 넓게 하는 것이 좋고, 산세리프 폰트는 수평 흐름이 없기 때문에 행간을 넓게 하는 것이 좋다. 그리고 한글 폰트도 행간을 넓게 해야 한다. 알파벳 활자에 비해 한글의 베이스라인이 아래에 있어 빽빽해 보이기 때문이다.[^35]

행간이 좁을 때와 마찬가지로, 글줄이 너무 길어도 독자가 같은 줄을 여러 번 읽는 실수를 하게 된다. 한편 글줄이 너무 짧으면 눈을 자주 움직여야하기 때문에 피곤하다.

또한 어간이 행간보다 넓어선 안 된다. 어간이 행간보다 넓어지면 글의 덩어리가 좌우가 아닌 상하로 인식된다. 아래 설명할 양끝맞춤을 할 때 의도치 않게 이런 문제가 생길 수 있다.

![어간이 행간보다 넓어선 안 된다.](/images/103473237-c5667400-4dd9-11eb-8974-9a066723a6e0.webp)

## 정렬

다양한 방식으로 문단을 정렬할 수 있다. 인쇄물에서 가장 인기있는 정렬은 양끝맞춤이다.

```css
text-align: justify;
```

![양끝맞춤. 어간이 일정하지 않다.](/images/103454631-5c272800-4d29-11eb-834e-b0931c693f16.webp)

양끝맞춤은 보편적이고 전통적인 조판 방식이다. 양끝이 균일하여 편안한 느낌을 주지만, 글줄의 글자수에 관계없이 글줄길이를 모두 똑같이 맞춰야 하기 때문에 어간이 고르지 않게 되는 문제가 있다. 특히 글자수가 적을 때 그 문제가 부각된다. 이로 인해 넓은 어간이 여러 글줄에 반복적으로 나타나면 흰강(White river) 현상이 발생한다.

![넓은 어간이 여러 글줄에 이어져 보이는 흰강현상.](/images/103651395-df07e700-4fa4-11eb-9ae9-121bf2237905.webp)

되도록이면 왼끝맞춤을 하자. 왼끝맞춤은 어간이 일정하고, 오른끝의 흘려짐 덕분에 시각적인 활기를 얻을 수 있다.[^40]

```css
text-align: left;
```

![왼끝맞춤. 어간이 일정하고 오른끝의 흘려진 모양에 활기가 있다.](/images/103454638-63e6cc80-4d29-11eb-85cd-c9b0574de7a8.webp)

사람은 문장의 시작 지점을 찾으며 글을 읽는다. 그래서 글줄의 시작 지점을 예측하기 쉽다면 가독성에는 영향을 끼치지 않기 때문에 오른끝이 균일하지 않아도 읽는 데 문제가 없다. 다만 왼끝맞춤을 할 때는 오른끝의 흘려진 모양에 주의할 필요가 있다. 웹에서는 이 모양을 아름답게 만드는게 쉽지 않기 때문에 아직까지는 감수해야 할 것 같다.

더 중요한 것은 `word-break` 속성을 이용해 단어의 끊김을 방지하는 것이다.

```css
word-break: keep-all;
```

![word-break: keep-all을 하면 글줄 끝에서 단어가 끊기지 않는다.](/images/103454974-58e16b80-4d2c-11eb-9105-e57bc2ce510c.webp)

왼쪽은 `keep-all`을 하지 않아 글줄 끝에서 단어가 끊기는 조판이고, 오른쪽은 이를 방지한 조판이다. 웹에서 `keep-all`을 하지 않아 발생하는 끔찍한 사례는 [@keepallvillain](https://twitter.com/keepallvillain)의 타임라인에서 모아볼 수 있다.

가운데맞춤은 공식적인 메시지를 전달할 때 사용한다. 글을 가운데맞춤하는 것으로 권위를 부여할 수 있다. 이때는 글줄의 시작 지점을 예측하기 어렵기 때문에 행간을 넓게 잡아야 한다.

![가운데맞춤. 권위를 갖는다.](/images/103459315-d4a1df00-4d51-11eb-8500-ff204b2903c3.webp)

## References

* [임순범 외 5명, "Requirements for Hangul Text Layout and Typography : 한국어 텍스트 레이아웃 및 타이포그래피를 위한 요구사항", W3C Working Group Note, 2020.](https://www.w3.org/TR/klreq/)
* 제임스 크레이그 외 2명, "타이포그래피 교과서", 최문경, 문지숙 역, 안그라픽스, 2010.

[^00]: [이용제, "타이포그라피에서 '글자, 활자, 글씨' 쓰임새 제안", 글자씨 2(2), 한국타이포그라피학회, 2010, 492-507쪽.](http://koreantypography.org/wp-content/uploads/thesis/kst_j2_2.pdf)
[^10]: [John Brownlee, "What’s The Difference Between A Font And A Typeface?", Fast Company, 2014.](https://www.fastcompany.com/3028971/whats-the-difference-between-a-font-and-a-typeface)
[^13]: ["OpenType® Specification", Microsoft Docs, 2020.](https://docs.microsoft.com/en-us/typography/opentype/spec/)
[^15]: [Jonathan Kew et al., "WOFF File Format 1.0", W3C Recommendation, 2012.](https://www.w3.org/TR/2012/REC-WOFF-20121213/)
[^17]: ["font-display", MDN Web Docs.](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display)
[^18]: [노민지, 윤민구, "KS 코드 완성형 한글의 추가 글자 제안", 글자씨 7(2), 한국타이포그라피학회, 2015, 153-175쪽.](http://koreantypography.org/wp-content/uploads/2016/02/kst_12_7_2_06.pdf)
[^20]: 원유홍 외 2명, "타이포그래피 천일야화", 안그라픽스, 2012, 87쪽.
[^25]: [강이룬, 소원영, "multilingual.js: 다국어 웹 타이포그래피를 위한 섞어쓰기 라이브러리", 글자씨 8(2), 한국타이포그라피학회, 2016, 9-33쪽.](http://koreantypography.org/wp-content/uploads/2016/08/kst_13_8_1_01.pdf.pdf)
[^27]: ["font-size", MDN Web Docs.](https://developer.mozilla.org/en-US/docs/Web/CSS/font-size)
[^28]: ["font-variant-ligatures", MDN Web Docs.](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures)
[^29]: ["text-rendering", MDN Web Docs.](https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering)
[^30]: ["line-height", MDN Web Docs.](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#Accessibility_concerns)
[^35]: [이주호, "한글의 가독성과 ko.TEX의 타이포그래피", The Asian Journal of TEX 2(2), 2008, 16쪽.](http://ajt.ktug.org/2008/0202juho.pdf)
[^40]: [우유니, "미움 받는 왼끝맞춤에 대한 변호", FDSC, 2020.](https://www.notion.so/d05890a595334bcb8f31d6c42dc7a079)
