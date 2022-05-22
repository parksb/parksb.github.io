---
id: 38
title: "🧱 Server Driven UI 설계를 통한 UI 유연화"
subtitle: "클라이언트 배포없이 화면 구성 변경하기"
date: "2021.07.09"
---

웹과 달리 네이티브 모바일 앱은 빌드, 배포 후에는 수정이 불가능하다. 만약 잘못된 위치에 버튼을 배치한 채로 스토어에 앱을 배포했다면, 그리고 사용자가 잘못된 버전의 앱을 설치했다면 버튼의 위치를 수정할 방법이 없다. 유일한 방법은 사용자가 스스로 스토어에 들어가 수정된 버전의 앱으로 업데이트하는 것 뿐이다.

배포 후 수정이 불가능하다는 특성이 부딪히는 또 다른 상황은 A/B 테스팅이다. 소프트웨어를 사용하는 동안 일어나는 사용자의 행동과 경험은 화면 구성이나 문구에 따라 크게 달라지기 때문에 최적의 화면을 디자인하는 것이 중요하다. 그런데 사용자의 행동과 경험을 예측하는 것은 매우 어려운 일이기 때문에 현실의 사용자들에게 다양한 유형의 UI를 제공하고, 어떤 UI가 적합한지 실측할 필요가 있다. 실제로 많은 소프트웨어 기업들이 사용자를 A, B 그룹으로 나누고 (더 많은 그룹으로 나눌 수도 있다.) 각 그룹에게 서로 다른 UI를 제공해 가장 적합한 UI를 선정하는 A/B 테스팅을 하고 있다.

유연한 UI를 제공하려면 UI가 클라이언트의 빌드와 배포로부터 자유로워야 한다. 이러한 목표를 이루기 위해 웹뷰와 같이 네이티브 환경을 벗어난 다양한 방법을 선택할 수도 있겠지만, 현실에서는 다양한 이유로 웹뷰를 사용할 수 없는 상황이 있다. 이 글에서는 웹뷰를 사용하지 않는다는 전제 하에 유연하게 UI를 다루기 위한 Server Driven UI 설계에 대해 소개하고자 한다.

## 서버에서 UI 다루기

클라이언트과 달리 서버는 언제든 변경, 배포할 수 있다. 그렇다면 서버에서 제공하는 API를 이용해 동적으로 클라이언트의 UI를 구성하면 어떨까? 서버가 API 응답에 UI 정보를 담아 클라이언트에 제공하고, 클라이언트가 API 응답에 따라 화면을 렌더링한다면 서버에서 API 응답을 변경하는 것만으로 클라이언트의 화면 구성을 동적으로 변경할 수 있을 것이다.

예를 들어 사용자에게 홈 화면을 제공하는 경우, 서버가 제공하는 REST API `screen`을 통해 `home` 화면에 대한 UI 정보를 얻을 수 있을 것이다.

```
GET /screen/home
```

이 API는 홈 화면을 구성하는 UI 요소 리스트를 JSON 포맷으로 응답한다. 따라서 클라이언트는 응답의 `data` 리스트를 순회하며 각각의 `type`에 해당하는 UI 요소를 화면에 그려주면 된다.

![앱바, 텍스트 버튼 2개가 배치된 화면.](/images/124375746-bf951100-dcde-11eb-8b50-9362fbf46ff9.webp)

이렇게 하면 클라이언트를 새로 배포하지 않아도 서버에서 `data` 리스트의 요소를 변경함으로써 클라이언트가 유연한 UI를 제공할 수 있을 것이다. 이처럼 UI에 대한 정보를 서버에서 관리, 제공하는 것이 Server Driven UI 설계의 기본 개념이다.

## GraphQL: 재사용 가능한 UI 컴포넌트 제공하기

서버에서 UI를 관리하면 유연성을 확보할 수 있지만, 사용하는 UI 요소의 재사용성을 고려하지 않으면 다양한 화면에서 UI 요소를 교체하기 어려워진다. 이러한 문제를 피하려면 모든 UI 요소를 재사용 가능한 컴포넌트로 구성하고, UI 컴포넌트를 다양한 화면에서 조립해서 사용할 수 있도록 만들어야 한다.

또한 수시로 화면에 새로운 컴포넌트가 추가되고 제거되면 서버와 클라이언트 사이의 타입 정의에 불일치가 발생하기 쉽다. 이때 GraphQL을 사용하면 서버와 클라이언트가 공유하는 스키마를 통해 API의 타입 안전성을 보장할 수 있다.

### 쿼리 설계

서버는 UI 컴포넌트 리스트를 반환하는 `screen` 쿼리를 통해 특정 화면에 대한 UI 정보를 제공한다.

```graphql
type Query {
  screen(screenType: ScreenType!): Screen!
}

enum ScreenType {
  HOME
  SIGN_IN
}

type Screen {
  components: [Component!]!
}
```

클라이언트는 `screen` 쿼리를 호출하며 홈 화면에서는 `screenType: HOME` 인자를, 로그인 화면에서는 `screenType: SIGN_IN` 인자를 전달할 것이다. 서버는 쿼리를 받으면 해당 `screenType`에 맞는 컴포넌트를 조합하여 `Screen` 타입의 `components` 필드에 `Component` 리스트를 담아 응답한다.

`Component`는 유니온 타입이다. 유니온 타입은 다양한 타입의 컴포넌트를 `Component`라는 하나의 타입으로 다룰 수 있게 해준다. `Screen` 타입의 `components` 필드가 `Component` 리스트를 반환한다는 것은 리스트 안에 `AppBar`, `TextButton`, `Image` 타입이 섞일 수 있다는 의미다.

```graphql
union Component = AppBar | TextButton | Image

type AppBar {
  title: String!
}

type TextButton {
  text: String!
  route: String
}

type Image {
  url: String!
}
```

만약 컴포넌트들이 공통 필드를 가진다면 `Component`를 유니온 타입 대신 인터페이스로 만들어도 된다.

```graphql
interface Component {
  position: Int!
}

type AppBar implements Component {
  position: Int!
  title: String!
}

type TextButton implements Component {
  position: Int!
  text: String!
  route: String
}

type Image implements Component {
  position: Int!
  url: String!
}
```

유니온 타입은 단순히 독립적인 컴포넌트 타입들을 하나의 타입으로 사용하기 위한 방식이었다면, 인터페이스는 각각의 컴포넌트 타입들이 추상 타입인 `Component`를 구현하는 방식이기 때문에 어떤 타입이 UI 컴포넌트인지 명확해진다는 장점이 있다.

### 요청과 응답

GraphQL의 재사용 가능한 필드 묶음인 프래그먼트(Fragment)는 UI 컴포넌트를 주고받기에 매우 적합하다. 클라이언트에서 컴포넌트를 요청할 때는 사용 가능한 모든 컴포넌트 프래그먼트를 요청할 것이다.

```graphql
query fetchScreen {
  screen(screenType: HOME) {
    components {
      ... on AppBar {
        __typename
        title
      }
      ... on TextButton {
        __typename
        text
        route
      }
      ... on Image {
        __typename
        url
      }
    }
  }
}
```

주의할 점은 '사용 가능한 모든 컴포넌트'를 요청한다는 점이다. 만약 구현 당시에 사용할 컴포넌트만 요청하면 차후 서버에서 다른 컴포넌트를 화면에 추가해도 보여줄 수 없기 때문이다.

요청을 받은 서버는 홈 화면에서 사용할 컴포넌트를 골라서 반환한다. 이 예시에서는 홈 화면에 `AppBar` 컴포넌트 하나와 `TextButton` 컴포넌트 두 개를 응답한다.

```rust
impl QueryRoot {
    fn screen(screen_type: ScreenType) -> FieldResult<Screen> {
        Ok(
            Screen {
                components: match screen_type {
                    ScreenType::Home => home_components(),
                    ScreenType::SignIn => sign_in_components(),
                }
            }
        )
    }
}

fn home_components() -> Vec<Component> {
    vec![
        Component::AppBar(AppBar {
            title: "Home".to_string(),
        }),
        Component::TextButton(TextButton {
            text: "Sign in".to_string(),
            route: Some("/sign_in".to_string()),
        }),
        Component::TextButton(TextButton {
            text: "Sign up".to_string(),
            route: None,
        }),
    ]
}
``` 

러스트로 서버 코드를 작성한 이유는 순전히 개인 취향이며, Server Driven UI나 GraphQL과는 전혀 관련이 없다. 다양한 언어로 된 GraphQL API 서버 구현체가 있기 때문에 언어의 선택은 문제가 되지 않는다.[^graphql-code]

요청이 성공하면 서버에서 의도한 GraphQL 응답을 받을 수 있다.

```json
{
  "data": {
    "screen": {
      "components": [
        {
          "__typename": "AppBar",
          "title": "Home"
        },
        {
          "__typename": "TextButton",
          "text": "Sign in",
          "route": "/sign_in"
        },
        {
          "__typename": "TextButton",
          "text": "Sign up",
          "route": null
        }
      ]
    }
  }
}
```

앞서 클라이언트가 `components` 필드 아래에 `Image` 프래그먼트도 요청했지만, 서버가 `Image` 컴포넌트를 응답하지 않았기 때문에 리스트에는 포함되지 않았다. 반대로 서버가 `Image` 컴포넌트를 응답했지만 클라이언트가 요청하지 경우에도 리스트에 포함되지 않는다. 따라서 서버가 신규 컴포넌트를 정의하거나 기존 컴포넌트에 신규 필드를 추가해도 구버전 클라이언트에서는 신규 컴포넌트와 필드를 요청하지 않기 때문에 클라이언트의 하위호환성을 확보할 수 있다. 단, 기존 컴포넌트에 대해 구버전 클라이언트에서 사용 중인 필드를 제거하거나 non-nullable 필드를 nullable 필드로 바꾸는 경우 하위호환성이 깨지므로 주의해야 한다. 

## Flutter: 견고한 디자인 시스템과 위젯으로 화면 그리기

통일감있는 컴포넌트를 사용하려면 디자인 시스템이 잘 잡혀 있어야 한다. 만약 UI 레벨에서 디자인 시스템이 정립되어 있지 않다면 애초에 컴포넌트를 개념을 도입하는 것이 어불성설일 뿐더러, 서버와 클라이언트, 디자인 사이에 사용하는 용어가 달라져 커뮤니케이션 비용도 증가한다. 

플러터(Flutter)의 [머티리얼 라이브러리(Material Library)](https://api.flutter.dev/flutter/material/material-library.html)는 구글의 머티리얼 디자인 시스템을 높은 수준으로 구현하고 있어 Server Driven UI를 바로 적용할 수 있다.

![플러터 머티리얼 컴포넌트 위젯 목록: Appbar, BottomNavigationBar, Drawer.](/images/123917302-995d3180-d9bd-11eb-8c4f-706ee9e92565.webp)

### 프래그먼트-컴포넌트-위젯 대응

플러터가 가진 위젯(Widget) 개념이 컴포넌트 개념과 부합한다는 점도 Server Driven UI 설계와 잘 맞는다. 플러터의 위젯은 웹 프론트엔드 프레임워크인 리액트(React)의 컴포넌트 시스템으로부터 영감을 받아 만들어졌으며, 각 위젯은 자신의 현재 상태에 따른 UI를 표현한다.[^flutter-widget]

클라이언트의 추상 클래스 `Component`는 서버에서 응답하는 GraphQL 유니온 타입 `Component`에 대응된다. `Component`를 구현하는 클래스는 위젯을 반환하는 `compose` 메서드를 함께 구현해야 한다.

```dart
abstract class Component {
  Widget compose(Map<String, dynamic> args, BuildContext context);
}
```

가령 앱 상단에 들어가는 앱바 UI를 의미하는 `AppBarComponent`는 `Component` 클래스를 구현하며, [`AppBar`](https://api.flutter.dev/flutter/material/AppBar-class.html) 위젯을 반환하는 `compose` 메서드를 갖는다.

```dart
class AppBarComponent implements Component {
  Widget compose(Map<String, dynamic> args, BuildContext context) {
    return AppBar(
      title: Text(args['title']),
    );
  }
}
```

`compose` 메서드는 `args` 인자의 `title` 프로퍼티에 접근해 앱바의 타이틀을 채운다. 이때 `args` 인자는 서버의 응답에 포함되는 `AppBar` 프래그먼트의 필드들이 `Map<String, dynamic>` 타입으로 전달될 것이다.

클라이언트가 서버로부터 받은 응답을 파싱한 다음, `components` 필드에 포함된 각각의 프래그먼트들을 자신의 컴포넌트에 대응시키고, 각 컴포넌트의 위젯에 대응시키려면 GraphQL 스키마를 바탕으로 한 컴포넌트 레지스트리가 필요하다.

```dart
class Registry {
  static final Map<String, Component> _dictionary = {
    'AppBar': AppBarComponent(),
    'TextField': TextFieldComponent(),
    'Image': ImageComponent(),
  };

  static Widget getComponent(dynamic component, BuildContext context) {
    var matchedComponent = _dictionary[component['__typename']];
    if (matchedComponent != null) {
      return matchedComponent.compose(component, context);
    } else {
      return null;
    }
  }

  static List<Widget> getComponents(dynamic components, BuildContext context) {
    var matchedComponent = components as List<dynamic>;
    return matchedComponent.map((component) => getComponent(component, context))
        .where((element) => element != null)
        .toList();
  }
}
```

클라이언트는 응답 내용을 바탕으로 위젯 리스트를 얻기 위해 레지스트리의 `getComponents` 메서드를 호출하고, `components` 필드를 순회하며 `getComponent` 메서드를 통해 프래그먼트를 위젯으로 변환한다.

`getCompnent` 메서드는 프래그먼트에 포함된 메타 필드 `__typename` 값을 이용해 각 프래그먼트를 컴포넌트에 대응시키고, 해당 컴포넌트의 `compose` 메서드를 호출해 컴포넌트 각각의 위젯을 반환한다. 만약 클라이언트가 모르는(`_dictionary`에 등록되지 않은) 컴포넌트가 응답에 포함되어 있다면 필터링될 것이다.

### 컴포넌트 조립

앞서 살펴본 레지스트리를 이용해 서버에서 응답하는 모든 컴포넌트를 위젯으로 변환하고, 각 화면에 맞는 위젯을 구성할 수 있게 되었다. 지금까지의 흐름을 서버, API 응답, 클라이언트로 정리하면 아래와 같다. 

![서버, GraphQL 응답, 클라이언트 흐름 도식.](/images/124376806-afcbfb80-dce3-11eb-8661-6cebf1f787c5.webp)

플러터 위젯 중 [`Container`](https://api.flutter.dev/flutter/widgets/Container-class.html)이나 [`Column`](https://api.flutter.dev/flutter/widgets/Column-class.html)과 같이 다른 위젯을 `child` 또는 `children`으로 담는 위젯도 같은 방식으로 만들 수 있다. 일종의 '컴포넌트의 컴포넌트'인 셈이다. 예를 들어 [`GridView`](https://api.flutter.dev/flutter/widgets/GridView-class.html) 위젯을 생각해보자. 그리드 뷰는 격자 셀이 반복되는 레이아웃으로, 각 셀에는 다른 위젯을 배치시킬 수 있다. 그리드의 열 개수와 각 셀에 넣을 컴포넌트를 서버에서 관리하고자 한다면 아래와 같이 스키마를 구성할 수 있을 것이다.

```graphql
type GridView {
  column_count: Int!
  chidren: [Component!]!
}
```

클라이언트에서 요청할 때는 `GridView` 프래그먼트의 `children` 필드 아래에 사용 가능한 모든 컴포넌트를 요청해야 한다. 같은 프래그먼트를 재사용하므로 인라인 프래그먼트 대신 별도의 기명 프래그먼트를 만들었다.

```graphql
query fetchScreen {
  screen(screenType: HOME) {
    components {
      ... AppBar
      ... TextButton
      ... Image
      ... on GridView {
        __typename
        column_count
        children {
          ... AppBar
          ... TextButton
          ... Image
        }
      }
    }
  }
}

fragment AppBar on AppBar {
  __typename
  title
}

fragment TextButton on TextButton {
  __typename
  text
  route
}

fragment Image on Image {
  __typename
  url
}
```

마지막으로 `GridVew` 위젯을 반환하는 `GridViewComponent`는 자신의 `children` 필드 값을 `getComponents`로 넘겨 위젯 리스트를 구성한다.

```dart
class GridViewComponent implements Component {
  Widget compose(Map<String, dynamic> args, BuildContext context) {
    return Expanded(
      child: GridView.count(
        padding: const EdgeInsets.all(20),
        crossAxisSpacing: 20,
        mainAxisSpacing: 20,
        crossAxisCount: args["columnCount"],
        children: Registry.getComponents(args["children"], context),
      ),
    );
  }
}
```

여기서는 `padding`, `crossAxisSpacing`, `mainAxisSpacing` 프로퍼티를 상수 값으로 설정했지만, 만약 서버에서 관리하고 싶다면 간단히 필드를 추가하고 값을 넣어주기만 하면 된다. 

이제 서버에서 `GridView`의 `children` 필드에 `TextButton` 두 개를 응답하면 클라이언트에서는 그대로 두 개의 셀에 `TextButton`이 담긴 화면을 구성한다. 그리드의 열 개수나 각 셀의 내용은 서버 응답을 수정하는 것만으로 언제든 변경할 수 있다. 

![Home, Sign in 화면 스크린샷.](/images/124346021-6a41fc80-dc17-11eb-8bf1-ef446ae0dfca.webp)

실제 동작하는 코드는 [github.com/parksb/server-driven-ui](https://github.com/parksb/server-driven-ui)에서 확인할 수 있다. 동작 방식이나 개념은 이 글에서 설명한 것과 동일하지만, 컴포넌트 종류나 구체적인 필드는 다소 차이가 있다. 또한 카카오스타일에서도 Server Driven UI 설계를 적극적으로 사용하고 있는데, [카카오스타일 기술 블로그](https://devblog.croquis.com/ko/2021-12-16-1-server-driven-ui)에서 자세히 볼 수 있다.

## References

* [김도훈, "Server Driven UI (Feat.Flutter)", 2020.](https://medium.com/@kimdohun0104/server-driven-ui-feat-flutter-87fcbb04e610)
* [박호준, "GraphQL이 가져온 에어비앤비 프론트앤드 기술의 변천사", DEVIEW 2020, 2020.](https://deview.kr/2020/sessions/337)
* [Tom Lokhorst, "Server Driven UI", Tom Lokhorst's blog, 2020.](http://tom.lokhorst.eu/2020/07/server-driven-ui)
* [Ryan Brroks, "A Deep Dive into Airbnb’s Server-Driven UI System", 2021.](https://medium.com/airbnb-engineering/a-deep-dive-into-airbnbs-server-driven-ui-system-842244c5f5)

[^graphql-code]: [The GraphQL Foundation, "GraphQL Code Libraries, Tools and Services".](https://graphql.org/code/)
[^flutter-widget]: [Flutter, "Introduction to widgets".](https://flutter.dev/docs/development/ui/widgets-intro)
