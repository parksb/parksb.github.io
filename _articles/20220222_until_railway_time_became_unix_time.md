---
id: 39
title: "철도 시간표가 유닉스 시간이 되기까지"
subtitle: "시간과 컴퓨터 공학"
date: "2022.02.22"
---

컴퓨터 공학에서 시간을 다루는 것은 꽤나 고달픈 일이다. 특히 우리가 일상에서 직관적으로 이해하는 시간 체계와 일상에서 의식하지 못하는 시간 체계의 괴리로 인해 소프트웨어 엔지니어들은 고통받는다. 이 글에서는 태양시, 원자시 등 시간 체계에 대해 알아보고, 컴퓨터에서 어떻게 시간을 다루는지 설명하고자 한다.

## 태양의 시간

![중세 천상지도](/images/154784238-9f37e239-1787-4687-ad85-9d940993219c.jpg)
*Stanford University Libraries (CC0)*

19세기초까지만 해도 지역마다 각자의 지방 평균시(Local Mean Time, LMT)를 사용했다. 지방 평균시는 각자의 지역에서 태양이 최고 고도에 이르는 시각을 기준으로 삼는 시간 체계이기 때문에 경도에 따라, 지방에 따라, 도시에 따라, 마을에 따라 사용하는 시간이 달랐다. 가령 런던에서 옥스포드로 가면 시간이 5분 앞으로 당겨졌고, 리즈에 가면 6분 앞으로 당겨졌다. 그래도 문제가 없었다. 마차를 끄는 말의 속도와 배를 움직이는 바람의 속도가 충분히 느렸기 때문에 그 정도의 시차는 중요치 않았다.

그런데 증기기관이 등장하고 각 지방을 연결하는 철도가 놓이면서 이동 시간이 비약적으로 줄어들자 정확한 시간이 중요해졌다. 8시 정각에 런던에서 출발한 기차가 정확히 1시간 뒤 옥스포드에 도착하면 옥스포드의 시계 기준으로는 9시가 아닌 8시 55분에 도착한다. 런던 시간에 맞춰진 기관사의 시계와 5분 차이가 발생하는 것이다. 기관사 시계 기준으로 9시 10분에 다시 런던으로 출발하면 옥스포드의 승객들은 5분 차이로 기차를 놓치게 된다. 승객은 몇 분의 시차로 인해 기차를 놓칠 수 있었고, 기관사는 몇 분의 시차로 인해 다른 기차와 충돌할 수도 있었다. 1840년 그레이트 웨스턴 철도는 런던의 그리니치 평균시(Greenwich Mean Time, GMT)를 모든 역과 시간표에서 사용하도록 했으며, 1847년 철도청산소[^1]는 영국의 모든 철도 회사가 가능한 빨리 GMT를 채택할 것을 권고했다.[^2] 결국에는 영국 전역에서 GMT를 표준시(Standard time)로 사용하게 된다.

GMT는 그리니치 천문대에서 관측하는 시간이다. 그리니치에서 태양이 최고 고도에 이르는 시각을 낮 12시로 정하고, 이로부터 다음날 태양이 최고 고도에 이르는 시각까지를 24시간으로 쪼갠다. 그러면 지구가 24시간 동안 360도를 회전하며, 1시간에 15도씩 돈다고 볼 수 있다. 따라서 그리니치를 지나는 자오선을 경도 0도의 기준으로 삼아 본초 자오선으로 정하고, 지구를 15도씩 쪼개면 경도 15도마다 1시간씩 차이가 발생한다. 이를 바탕으로 영역을 구분한 것을 시간대(Time zone)라고 부르며, 런던은 GMT+0, 베를린은 런던보다 1시간 빠른 GMT+1, 서울은 8시간 30분 빠른 GMT+08:30 시간대에 놓이게 된다. 여러 제국주의 열강들이 자국의 수도를 지나는 자오선을 본초 자오선으로 정하고자 했지만, 이미 곳곳에서 사용되던 GMT가 세계시(Universal time)의 기준이 되었다.

평균시라는 말을 쓰는 이유는, 오늘 태양이 최고 고도에 이르는 시각부터 내일 태양이 최고 고도에 이르는 시각까지 정확히 24시간이 걸리지 않기 때문이다. 지구는 타원으로 공전하고, 태양은 타원의 중심에 있지 않고, 지구가 태양과 가까워지면 공전 속도가 빨라지며, 멀어지면 공전 속도가 느려지고, 지구의 자전축은 23.5도 기울어져있다. 따라서 태양이 최고 고도에 이르는 시각을 무조건 12시 정각으로 삼는 겉보기 태양시를 사용하면 매일 하루의 길이에 몇 초씩 차이가 발생한다. 이러한 겉보기 태양시의 오차를 보정하기 위해 겉보기 태양시의 평균을 낸 시간 체계를 평균시라고 말한다. 즉, 하루가 24시간이라는 말은 하루가 평균적으로 24시간이라는 말이다. 앞서 GMT를 겉보기 태양시로 관측하는 것처럼 설명했는데, 사실 겉보기 태양시로부터 얻은 평균시라는 점에 유의해야 한다.

## 원자의 시간

![세슘 원자 시계 옆에 서 있는 두 과학자](/images/154784465-691551bd-e7af-42ec-8824-fb86ec9b6517.webp)
*UK National Physical Laboratory (CC0)*

GMT처럼 태양을 기준으로 하는 시간 체계를 통틀어 태양시(Solar time)라고 한다. 그런데 20세기에 조석력으로 인해 지구의 자전 속도가 불규칙하다는 사실을 알게 된다. 이전까지는 지구가 태양 주위를 한 바퀴 도는 시간인 31,556,992초를 기준으로 1 / 31556992를 1초의 정의로 사용했는데, 그 정의가 불규칙하다는 뜻이 된다. 그러다 1955년 세슘(Caesium, $_{55}\text{Cs}$)의 유일한 안정 동위원소 세슘-133을 이용한 원자 시계가 나왔고, 1967년 국제도량형총회(CGPM)는 세슘-133 원자가 방출, 흡수하는 전자기파가 9,192,631,770번 진동하기까지 걸리는 시간을 1초로 정의했다.[^3] 이처럼 원자를 기준으로 하는 시간 체계를 원자시(Atomic Time)라고 하며, 전세계 수백 개의 원자 시계에서 측정하는 원자시를 바탕으로 국제원자시(International Atomic Time, TAI) 표준을 정한다.

1초의 기준이 태양시가 아닌 원자시로 변경되었기 때문에 세계시의 기준인 GMT도 다시 생각해볼 필요가 있었다. 이에 따라 원자시를 기반으로 한 협정 세계시(UTC)를 GMT 대신 사용하게 되었다. 약자가 UTC인 이유는 CUT(Coordinated Universal Time)를 추진한 영미권과 TUC(Temps Universel Coordonné)를 추진한 프랑스어권 사이의 절충안으로, 같은 알파벳 구성에 순서만 뒤바꾼 UTC를 채택했기 때문이다.[^31]

그런데 UTC와 GMT는 소수점 단위에서만 차이가 날 뿐만 아니라, UTC도 그리니치 자오선과 거의 차이가 없는 자오선을 본초 자오선으로 삼고 있기 때문에 일상에서는 UTC와 GMT를 혼용한다. UTC의 시간대도 GMT와 마찬가지로 런던은 UTC+0, 베를린은 UTC+1, 서울은 UTC+08:30 시간대에 놓인다. 단, 각국의 표준 시간대는 이를 그대로 따르지 않고 각자의 결정권에 따라 채택한다. 파리는 UTC+0 시간대에 있지만 중앙유럽 표준시(Central European Time, CET)에 따라 UTC+1을 사용하며, 서울은 UTC+08:30에 있지만 한국 표준시(Korean Standard Time, KST)를 따라 UTC+9를 사용한다. 서머타임(Summer time) 혹은 일광절약시간제(Daylight Saving Time, DST)를 사용하는 국가에서는 계절에 따라 또 다른 시간대를 사용한다.

![공식 시간대 지도](/images/154424888-252d99a9-68ac-4d34-8c99-26510b42b240.webp)
*US Central Intelligence Agency (CC0)*

앞서 언급했듯이 지구의 자전 속도가 불규칙하기 때문에 천체의 움직임을 기반으로 하는 태양시와 원자시를 기반으로 하는 UTC 사이에는 오차가 발생한다. 국제지구자전좌표국(International Earth Rotation and Reference Systems Service, IERS)은 태양시와 UTC 사이의 오차가 0.9초를 넘으면 이를 보정하기 위해 UTC에 1초를 더하거나 빼주는데, 이를 윤초(Leap second)라고 한다.[^4] 태양시를 중심으로 사용하던 과거에는 지구의 자전 속도에 따라 시간 체계가 통째로 영향을 받았지만, 이제는 자전 속도가 변한만큼 윤초를 이용해 시간을 보정할 수 있게 된 것이다. 윤초는 UTC 기준 6월 30일 또는 12월 31일 23시 59분 59초에 적용하며, 1초 뒤를 0시 0분 0초가 아닌 23시 59분 60초로 표현하는 방식으로 윤초를 추가한다. IERS는 통상 6개월 전에 윤초 적용을 예고하고 있다.

## 운영체제의 시간

![회로 기판의 댈러스 반도체 RTC](/images/10679e77-3fe9-48cf-87d3-95e1b815bcf9.webp)
*Raimond Spekking (CC BY-SA 4.0)*

컴퓨터는 RTC(Real Time Clock)라는 하드웨어 장치를 이용해 시간을 측정한다. 오늘날 시간 정보가 필요한 거의 모든 전자기기에는 RTC가 들어있다. 대부분의 RTC는 수정 발진기(Quartz oscillator)를 사용하는데, 석영 결정에 전압을 걸었을 때 32.768kHz 주파수로 진동하는 것을 1초의 기준으로 삼는 원리다.[^12] 전원이 분리되어 있어서 컴퓨터가 꺼져도 RTC는 꾸준히 시간을 측정할 수 있다.

운영체제 수준에서는 컴퓨터 시스템 전역에 설정된 시간을 시스템 시간(System time)이라고 한다. 리눅스에서 `timedatectl` 명령을 실행하면 시스템의 로컬 시각(Local time)과 UTC 시각, RTC 시각, 타임존 등의 정보를 볼 수 있다.

```
$ timedatectl
                      Local time: Sun 2022-01-02 00:00:00 KST
                  Universal time: Sat 2022-01-01 15:00:00 UTC
                        RTC time: Sat 2022-01-01 15:00:00
                       Time zone: Asia/Seoul (KST, +0900)
       System clock synchronized: yes
systemd-timesyncd.service active: yes
                 RTC in local TZ: n
```

유닉스 계열 운영체제는 UTC 기준 1970년 1월 1일 0시 0분 0초로부터 몇 초가 지났는지를 기준으로 시스템 시간을 관리한다. 이를 유닉스 시간이나 POSIX 시간, 또는 에포크 시간(Epoch time)이라고 부른다. 에포크는 UTC 기준 1970년 1월 1일 자정을 일컫는다. 하필 이 날짜인 이유는 그리 대단치 않다. 벨 연구소에서 유닉스 시스템을 개발한 데니스 리치(Dennis Ritchie)는 그저 당분간 오버플로우가 발생하지 않을만한 기원 날짜를 하나 정하기로 했는데 우연히 1970년 1월 1일을 고르게 되었다고 말했다.[^5]

유닉스 시간은 일반적으로 초 또는 밀리초 단위의 타임스탬프(Timestamp)로 표현한다. 가령 UTC 기준 2022년 1월 1일 0시 0분 0초의 타임스탬프는 `1640995200`이다. 이 타임스탬프는 시간대에 상관없이 특정 순간(Instant)을 표현하기 때문에 CET(UTC+1) 기준 2022년 1월 1일 1시 0분 0초에도 대응되고, KST(UTC+9) 기준 2022년 1월 1일 9시 0분 0초에도 대응된다. `2022-01-01T00:00:00Z`, `1640995200`(초), `1640995200000`(밀리초) 모두 같은 시각에 대한 타임스탬프이다. 날짜, 시간 데이터에 대한 표준 규격은 ISO 8601에서 정의하고 있으며[^9], 인터넷 표준으로는 RFC 3339에서 ISO 8601을 기반으로 정의하고 있다.[^10]

32비트 정수형을 사용하는 유닉스 시간은 2,147,483,647까지 밖에 표현할 수 없는데, 이로 인해 UTC 기준 2038년 1월 19일 3시 14분 7초를 지나면 오버플로우가 발생한다. 이를 2038년 문제(Year 2038 Problem, Y2K38)라고 한다. 64비트 시스템에서는 이미 유닉스 시간에 64비트 정수형을 사용하고 있지만, 구형 시스템은 조치가 필요하다.

운영체제의 표준 인터페이스와 환경을 정의하는 IEEE Std 1003.1-2017에는 ‘에포크로부터 경과한 초’(Second Since the Epoch)를 ‘에포크로부터 경과한 초에 근사한 값’으로 정의한다. 단순한 사칙연산만으로 UTC로부터 유닉스 시간을 구할 수 있다.[^7]

```c
tm_sec + tm_min*60 + tm_hour*3600 + tm_yday*86400 +
    (tm_year-70)*31536000 + ((tm_year-69)/4)*86400 -
    ((tm_year-1)/100)*86400 + ((tm_year+299)/400)*86400
```

유닉스 시간이 UTC를 근사할 뿐 일대응 대응하지 않는 이유는 윤초를 전혀 고려하지 않기 때문이다. 이로 인해 구현은 단순해졌지만, 시간이 단조 증가한다고 보장할 수 없는 문제가 발생한다. 실제로는 UTC에 윤초가 추가된다 해도 시스템에서 1일은 정확히 86,401초다. 따라서 12월 31일 23시 59분 60초의 타임스탬프와 1월 1일 0시 0분 0초의 타임스탬프가 동일하다. 즉, 같은 시간을 두 번 지나며, 소수점 단위에서 시간이 역행할 수도 있다.[^8]

윤초를 차치하고도 시스템 시간은 꼭 단조 증가하지 않는다. 아주 단순한 파이썬 코드에도 문제가 생길 수 있다. 프로그램 실행 중에 사용자가 시스템에 설정된 시각을 12시간 앞으로 되돌리는 바람에 프로그램의 실행 시간이 -12시간이 걸렸다고 잘못 측정되는 케이스다.

```python
import time

start = time.time() # 2022-01-01T19:00:00
do_something() # 임의로 시스템에 설정된 시각을 과거로 되돌린다
end = time.time() # 2022-01-01T07:00:00

print(end - start) # 실행에 -12시간이 걸렸다
```

다행히 대부분 언어의 표준 라이브러리는 단조 시계(Monotonic clock)를 사용할 수 있는 API를 제공한다. 단조 시계는 현재 시각을 가리키는 것이 아니라, 일반적으로 운영체제 구동 이후 몇 초가 지났는지를 가리키기 때문에 시간이 역행하지 않음을 보장한다. 파이썬의 표준 라이브러리 모듈 `time`에는 `monotonic` 함수가 있다.[^101]

```python
import time

start = time.monotonic() # 2022-01-01T19:00:00
do_something() # 임의로 시스템에 설정된 시각을 과거로 되돌린다
end = time.monotonic() # 2022-01-01T19:01:00

print(end - start) # 실행에 1분이 걸렸다
```

러스트의 표준 라이브러리 모듈 `time`의 `SystemTime` 구조체에 대한 문서는 시간이 단조 증가하지 않는다는 유의 사항을 아주 구체적으로 밝히며 단조 증가하는 시간이 필요하다면 `Instant` 구조체를 사용하라고 안내하고 있다.[^11] 리눅스에서는 `clock_gettime` 시스템 콜[^14]을 통해 시스템 시간에 접근할 수 있는데, `CLOCK_REALTIME` 인자를 전달하면 시스템에 설정된 현재 시각을 얻을 수 있고, `CLOCK_MONOTONIC` 인자를 전달하면 단조 시계로 측정된 시간을 얻을 수 있다.[^15]

네트워크 타임 프로토콜(Network Time Protocol, NTP)을 이용해 원자 시계와 동기화된 서버로부터 정확한 UTC 기준 타임스탬프를 받아와 RTC 시간 내지는 시스템 시간과 동기화하는 것도 가능하다.[^16] 물론 여기에는 윤초도 적용되며, 실제로 리눅스는 윤초를 처리하기 위해 NTP를 사용하고 있다. 만약 양의 윤초가 추가되면 UTC가 시스템의 시계를 따라잡을 때까지 시계 속도를 늦추는 등의 방식으로 시스템 시간에 윤초를 적용할 수 있다.[^161] NTP 시스템은 네트워크 지연을 최소화하기 위해 계층 구조를 이룬다. 0 계층(Stratum 0) 원자 시계와 직접 동기화되는 1 계층(Stratum 1) NTP 서버가 있고, 1 계층과 동기화되는 2 계층 NTP 서버가 있다. 한국에서는 한국표준과학연구원, 포항공과대학교 등에서 1 계층 NTP 서버를 운영하고 있다.[^17]

## 애플리케이션의 시간

불특정 다수에게 서비스하는 웹 서버는 클라이언트의 접속 위치를 특정할 수 없으므로 다양한 시간대와 시간 표현 등을 고려해야 한다. 어떤 사용자는 UTC+9 시간대에서 서비스를 이용하고, 어떤 사용자는 UTC+05:45 시간대에서 이용한다. 그리고 또 어떤 사용자는 DST가 적용된 시간대에서 이용한다. 이들 모두에게 적절한 시간 정보를 제공하기 위해서는 서버가 일관된 시간대를 사용해야 한다. 일반적으로 직관적인 계산을 위해 서버 시간대는 UTC+0으로 설정한다. 따라서 서버와 클라이언트 사이에 사용하는 API도 UTC+0 시간대를 전제한다.

API를 통해 서버와 클라이언트가 시간 데이터를 주고받을 때는 주의할 필요가 있다. [연호를 사용하는 일본력은 어떻게 표현할지](https://www.sungdoo.dev/programming/debugging/japanese-calendar), [1970년 이전에 태어난 사람의 생일은 어떻게 표현할지](https://twitter.com/disjukr/status/1488051679123546112) 고민해야 한다. 마이크로소프트 REST API 가이드라인은 ECMAScript 언어 명세에서 정의한 `YYYY-MM-DDTHH:mm:ss.sssZ` 포맷[^171]을 사용하는 `DateLiteral` 형식을 제안한다.

```json
{ "creationDate" : "2015-02-13T13:15Z" }
```

또한 시간의 종류(`kind`)와 그 값(`value`)을 함께 제공할 수 있는 `StructuredDateLiteral` 형식도 함께 제시하고 있다.[^18]

```json
[
  { "creationDate" : { "kind" : "O", "value" : 42048.55 } },
  { "creationDate" : { "kind" : "E", "value" : 1423862100000 } }
]
```

대부분의 현대 프로그래밍 언어들은 효과적으로 시간을 다루기 위한 인터페이스를 갖추고 있다. 코틀린의 경우 자바의 표준 라이브러리를 확장한 인터페이스를 제공한다. 자바의 시간 라이브러리는 각종 문제를 지닌 것으로 악명이 높았지만,[^19] 다행히 현재 코틀린은 자바8부터 수정된 인터페이스를 사용하고 있다. 에포크 시간의 타임스탬프를 다루는 `Instant` 클래스와 기간을 다루는 `Duration` 클래스 등이 있으며, 시간대 정보가 없는 `LocalDateTime` 클래스, 시간대 정보를 지닌 `ZonedDateTime` 클래스도 제공된다. 만약 시간대 정보가 없는 `LocalDateTime` 시각을 `Instant` 객체로 변환하고 싶다면 시간대 정보가 필요하다.

```kotlin
LocalDateTime.of(2022, 1, 1, 0, 0, 0).toInstant(ZoneOffset.of("+0900"))
```

`LocalDateTime`에 시간대 정보가 없기 때문에 `toInstant` 함수에 `ZoneOffset`을 인자로 전달해 해당 시각을 어떤 시간대로 취급할 것인지 명시했다. 2022년 1월 1일 자정을 UTC+0(`ZoneOffset.UTC`)으로 취급하면 타임스탬프가 `1640995200000`이 되는 반면, UTC+9(`ZoneOffset.of("+9")`)로 취급하면 `1640962800000`가 되어 32400000 밀리초(9시간)만큼 차이가 발생한다. 같은 시간에 대한 타임스탬프가 서로 다른 것처럼 느껴지지만, 사실은 시간대가 전제되는 것이다. `LocalDateTime`을 사용한다면 항상 UTC+0 기준임을 전제하는 것이 혼란을 줄이는 데 도움이 된다. 마찬가지로 `LocalDateTime` 시각을 특정 시간대의 시각으로 변환할 때 역시 취급할 시간대 정보를 명시해야 한다.

```kotlin
fun LocalDateTime.toKST(zoneId: ZoneId = ZoneId.of("UTC")) =
  ZonedDateTime.of(this, zoneId)
    .withZoneSameInstant(ZoneId.of("Asia/Seoul"))
    .toLocalDateTime()
```

UTC 시각을 KST 시각으로 바꾸기 위해 `plusHours(9)`를 적용하는 것보다 훨씬 우아하다.

한 국가의 표준시는 정치적, 사회적 이유로 언제든 변경될 수 있다. 한국은 1954년에 표준시를 GMT+9에서 GMT+08:30으로 변경했다가 1961년부터 다시 GMT+9(UTC+9)를 쓰고 있다. 2013년에는 표준시를 UTC+08:30으로 변경하는 표준시법 개정안이 발의되기도 했다. 또한 1948년부터 60년까지, 그리고 87년부터 88년까지 DST를 시행했다. 많은 시스템이 과거와 현재, 그리고 미래의 시간대 정보까지 정확하게 보장받기 위해 별도의 표준 데이터베이스인 TZDB(IANA Time Zone Database)를 참조한다. TZDB는 엔지니어, 역사학자 커뮤니티가 운영하고 있어 상당히 신뢰도가 높다.[^20]

여기까지 태양시부터 철도 시간, 원자시, 시스템 시간과 유닉스 시간, 그리고 애플리케이션 수준에서의 시간을 살펴봤다. 시간은 까다로운 개념이고, 그것을 다루는 것은 더 까다로운 일이다. 시간 체계를 이해하고 있어도 실수를 하겠지만, 적어도 문제가 발생했을 때 무엇이 왜 잘못됐는지는 이해할 수 있을 것이다. 나는 시간과 관련된 실수를 많이 했다. 그런 실수들의 원인을 총체적으로 이해한 것은 실제 시간 체계와 내가 사용하는 API의 시간 체계를 이해한 뒤였다. 이 글은 과거에 대한 반성문이자 오답 노트이며, 이 오답 노트가 앞으로 나와 같은 실수를 할 소프트웨어 엔지니어에게 도움이 되길 바란다.

[^1]: 철도 회사들이 서로의 철도를 사용했을 때 수익을 배분하기 위한 단체, 영국 철도 위원회 설립 전까지 영국 철도를 관리, 감독했다.
[^2]: [Greenwich Mean Time, "Railway Time - From natural time to clock time".](https://greenwichmeantime.com/articles/history/railway/)
[^3]: [BIPM, "The International System of Units 9th edition", 2019, p.130.](https://www.bipm.org/documents/20126/41483022/SI-Brochure-9.pdf)
[^31]: [NIST, "NIST Time Frequently Asked Questions", 2019.](https://www.nist.gov/pml/time-and-frequency-division/nist-time-frequently-asked-questions-faq#cut)
[^4]: [이태형, "윤초와 1초의 의미", The Science Times, 2017.](https://www.sciencetimes.co.kr/news/%EC%9C%A4%EC%B4%88%EC%99%80-1%EC%B4%88%EC%9D%98-%EC%9D%98%EB%AF%B8/)
[^5]: [Farhad Manjoo, "Unix Tick Tocks to a Billion", Wired, 2001.](https://www.wired.com/2001/09/unix-tick-tocks-to-a-billion/)
[^7]: [_The Open Group Base Specifications Issue 7, 2018 edition_, "General Concepts", IEEE Std 1003.1-2017, 2018.](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap04.html#tag_04_16)
[^8]: [강성훈, "time()", 메아리 저널, 2009.](http://mearie.org/journal/2009/01/time.ko)
[^9]: [_Date and time - Representations for information interchange - Part 1: Basic rules_, ISO 8601-1:2019, 2019.](https://www.iso.org/standard/70907.html)
[^10]: [G. Klyne, C. Newman, "Date and Time on the Internet: Timestamps", RFC 3339, 2002.](https://www.rfc-editor.org/rfc/rfc3339.html)
[^101]: [_Python 3.10.2 Documentation_, "time - 시간 액세스와 변환", 2022.](https://docs.python.org/ko/3/library/time.html#time.monotonic)
[^11]: [_The Rust Standard Library Version 1.58.1_, "SystemTime in std::time", 2022.](https://doc.rust-lang.org/std/time/struct.SystemTime.html)
[^12]: [Kalpesh Lodhia, "Quartz clocks and watches - How do they work?", Arnik Jewellers, 2015.](https://www.arnikjewellers.com/blogs/news/72016387-quartz-clocks-and-watches-how-do-they-work)
[^14]: 운영체제 위에서 동작하는 응용 프로그램이 커널의 서비스에 접근할 수 있도록 하기 위한 인터페이스를 말한다.
[^15]: [_The Open Group Base Specifications Issue 7, 2018 edition_, "clock_getres", IEEE Std 1003.1-2017, 2018.](https://pubs.opengroup.org/onlinepubs/9699919799/functions/clock_getres.html)
[^16]: [D. Mills et al., "Network Time Protocol Version 4: Protocol and Algorithms Specification", RFC 5905, 2010.](https://datatracker.ietf.org/doc/html/rfc5905)
[^161]: [Miroslav Lichvar, "Five different ways to handle leap seconds with NTP", Red Hat Developer, 2015.](https://developers.redhat.com/blog/2015/06/01/five-different-ways-handle-leap-seconds-ntp)
[^17]: [이화여자대학교 사범대학 부속초등학교, "국내 타임서버 리스트", 2021.](http://time.ewha.or.kr/domestic.html)
[^171]: [_The ECMAScript Language Specification_, "Date Time String Format", "Standard ECMA-262 5.1 Edition", 2011.](https://262.ecma-international.org/5.1/#sec-15.9.1.15)
[^18]: [Dave Campbell et al., "Microsoft REST API Guidelines, Guidelines for dates and times", Microsoft, 2021.](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md#112-guidelines-for-dates-and-times)
[^19]: [정상혁, "Java의 날짜와 시간 API", Naver D2, 2014.](https://d2.naver.com/helloworld/645609)
[^20]: [김동우, "자바스크립트에서 타임존 다루기 (1)", NHN Cloud Meetup, 2017.](https://meetup.toast.com/posts/125)
