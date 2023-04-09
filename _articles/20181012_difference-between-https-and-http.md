---
id: 24
title: "🔐 HTTPS는 어떻게 다를까?"
subtitle: "진짜 데이터를 뜯어보았다"
date: "2018.10.12"
---

이미 HTTPS의 중요성은 널리 알려져 있다. 크롬, 파이어폭스와 같은 브라우저는 HTTP 서버에 접속할 때 경고를 띄우니 사용자 경험을 위해서라도 HTTPS는 필수라고 할 수 있다. 내가 [개떡같은 코드와 함께한 하루 리뉴얼 이야기](https://parksb.github.io/article/15.html)에서 그렇게 삽질한 이유이기도 하다.

HTTPS를 사용하면 데이터가 암호화되고, 보안에 좋다는 것은 알았지만, HTTP 접속과 비교하며 실제로 오가는 데이터를 분석해보니 그 사실이 더욱 가깝게 다가왔다. 컴퓨터 네트워크에 대한 배경 지식은 [Top-Down으로 접근하는 네트워크](https://parksb.github.io/article/23.html)를 참고.

## 🦈 Wireshark 사용하기

[Wireshark](https://www.wireshark.org/)는 오픈소스 패킷 분석 프로그램이다. (패킷은 네트워크에서 오가는 데이터 조각을 말한다.) Wireshark를 사용하면 네트워크 상에서 이동하는 패킷을 캡쳐해 그 내용을 볼 수 있다. PCAP은 트래픽을 캡쳐하기 위한 인터페이스이기 때문에 Wireshark를 설치할 때 꼭 같이 설치해야 한다.

![와이어샤크 첫 화면. 와이파이, 이더넷, 버추얼 박스 호스트 네트워크 등 인터페이스 목록.](/images/46820899-416fde00-cdc2-11e8-95ac-74230c5c0476.png)

첫 화면에 다양한 인터페이스가 보이는데, 와이파이에 연결된 노트북과 네트워크 사이에 오가는 패킷을 캡처하고 싶으니까 Wi-Fi를 선택했다.

필터를 설정하지 않으면 해당 인터페이스의 모든 패킷이 잡힌다. 그 양이 상상 이상으로 많고, 속도도 빠르기 때문에 필터를 잘 설정해 원하는 데이터만 골라서 보는 것이 중요하다. 상단 'Apply a display filter'에 필터 조건을 입력하면 해당 조건에 맞는 패킷만 골라서 보여준다.

## 🔌 HTTP 접속

이후 HTTP 접속과 HTTPS 접속을 비교해야 하므로 HTTP 주소에 접속해도 HTTPS로 리다이렉트되지 않는 사이트를 먼저 찾아야 했다. 예상대로(?) 학교 홈페이지는 [http://www.ajou.ac.kr](http://www.ajou.ac.kr)도 접속이 가능하고, [https://www.ajou.ac.kr](https://www.ajou.ac.kr)도 접속이 가능했다.

Wireshark를 켜둔 채 브라우저를 통해 [http://www.ajou.ac.kr](http://www.ajou.ac.kr)에 접속하면 Wireshark에 캡처된다. 수많은 데이터 속에 파묻혀 버리지 않도록 다음과 같은 필터를 만들었다:

```
ip.addr == 202.39.0.19 && http
```

이제 source나 destination의 아이피가 `202.39.0.19`이고, 프로토콜이 HTTP인 패킷만 보여준다. 서버 아이피는 cmd에서 `ping www.ajou.ac.kr`을 실행해 확인했다.

브라우저에서 [http://www.ajou.ac.kr](http://www.ajou.ac.kr)을 새로고침하니 패킷이 쭉 나왔다. 그 중 하나를 선택해 내용을 살펴봤다.

### HTTP Request Message

![HTTP 요청 메시지. Host, User-Agent, Referer 등 헤더를 포함.](/images/46820151-7713c780-cdc0-11e8-9375-c29b9d82addf.webp)

[http://www.ajou.ac.kr](http://www.ajou.ac.kr)에게 `/_resources/new/img/index/btn_pop_close.gif`를 요청하는 HTTP 메시지이다. HTTP 요청 메시지는 크게 Request line, Header lines, Entity body로 나눌 수 있다. Request line에는 `GET /_resources/new/img/index/btn_pop_close.gif HTTP/1.1\r\n`이 있고, 그 아래 Header lines에는 Host, User-Agent, Accept-Langueage 등 여러 헤더들이 따라온다.

User-Agent 헤더를 통해 클라이언트가 파이어폭스를 사용하고 있다는 점을 알 수 있고, Referer를 통해 클라이언트가 [http://www.ajou.ac.kr/main/index.jsp](http://www.ajou.ac.kr/main/index.jsp)에서 넘어왔다는 것을 알 수 있다. Referer를 보면 블로그의 방문자 유입 경로와 같은 정보를 얻을 수 있다.

그리고 쿠키도 보이는데, 여기서는 `PHAROS_VISITOR`와 `JSESSIONID`라는 쿠키가 사용되었다. `JSESSIONID`는 톰캣 서버에서 JSP를 실행할 때 세션ID를 구분하려는 목적으로 만들어진 쿠키다. `PHAROS_VISITOR`는 어떤 목적으로 쓰이는지 알 수 없었다.

### HTTP Response Message

![HTTP 응답 메시지. Date, Last-Modified, Content-Type 등 헤더를 포함.](/images/46820158-7844f480-cdc0-11e8-9c0a-952badf7662b.webp)

앞선 요청에 대한 서버의 응답 메시지다. HTTP 응답 메시지는 Status line, Header lines, Entity body로 나눌 수 있으며, Status line에 요청이 잘 처리되었다는 의미인 `200 OK`가 담긴 것을 볼 수 있다.

한편 Last-Modified 헤더를 통해 캐시된 파일이 2017년 2월 23일 목요일에 마지막으로 수정되었다는 것과 Content-Type 헤더를 통해 GIF 이미지이라는 것도 알 수 있다. (사진 캡처한게 10월 11일 오후 11시쯤인데 Date가 왜 오후 1시로 나온건지 모르겠다.)

마지막으로 Body에는 GIF 파일이 담겨있다.

### Conditional GET

사실 클라이언트는 오리진 서버에게 바로 요청 메시지를 보내지 않고, 중간에 있는 프록시 서버에게 메시지를 보내 요청하는 오브젝트가 캐시되어 있는지 확인한다. 이때, 프록시 서버로 하여금 오리진 서버에게 캐시된 파일이 변경됐는지 확인하도록 하는 것이 conditional GET이다.

![HTTP 요청 메시지. If-Modified-Since 헤더를 포함.](/images/46820153-77ac5e00-cdc0-11e8-946c-6d07497e4e6f.webp)

conditional GET의 동작을 보기 위해 또 다른 패킷을 살펴봤다. HTTP 요청 메시지에 If-Modified-Since 헤더가 포함되어 있으면 프록시 서버는 오리진 서버에게 요청을 보내 캐시된 파일이 변경됐는지 확인한다. 위 메시지에는 If-Modified-Since 헤더가 있으므로 프록시 서버가 오리진 서버에게 메시지를 보냈을 것이다.

![HTTP 응답 메시지. 304 Not Modified 상태 코드.](/images/46820152-77ac5e00-cdc0-11e8-8883-5e0f072437e2.webp)

`304 Not Modified` 응답이 왔다. 파일이 변경되지 않았다는 의미로, 그냥 프록시 서버에 캐시된 리소스를 사용했다.

## 🔌 HTTPS 접속

HTTPS는 HTTP 프로토콜에 SSL 프로토콜을 더해 보안을 강화한 것이다. 즉, 새로운 프로토콜이 아니다. 더 엄밀히 말하자면 SSL 프로토콜은 과거에 사용되었고, 지금은 SSL을 발전시킨 TLS를 사용한다. 하지만 대체로 SSL과 TLS를 섞어서 말한다.

HTTP로 접속했을 때는 모든 패킷의 내용을 뜯어 볼 수 있었다. HTTPS는 어떨까? 먼저 Wireshark의 필터를 수정한다:

```
ip.addr == 202.39.0.19 && ssl
```

그리고 브라우저에서 [https://www.ajou.ac.kr](https://www.ajou.ac.kr)로 접속하면 프로토콜이 TLS인 패킷만 캡쳐되는 것을 볼 수 있다.

![와이어샤크로 본 TLS 핸드셰이킹 과정. Client Hello, Server Hello, Certificate 등 패킷을 교환.](/images/46820157-7844f480-cdc0-11e8-9016-4eb02a644f95.webp)

먼저 접속 과정에서 HTTP와 다른 점을 찾을 수 있다. HTTPS로 접속할 때는 TCP Three-way handshake와 별도로 TSL handshake 과정을 거친다.

![TLS 핸드셰이킹 과정을 도식화. Client hello, Server hello, Client key exchange, Client finished, Server finished.](/images/54861461-66eb1580-4d6c-11e9-8e89-806544c7a1cd.gif)

IBM의 [An overview of the SSL or TLS handshake](https://www.ibm.com/support/knowledgecenter/en/SSFKSJ_7.1.0/com.ibm.mq.doc/sy10660_.htm)에 따르면 TLS handshake 과정에서는 서버와 클라이언트 인증서를 검증하고, 클라이언트 키를 교환한다. 앞서 캡처된 패킷에서 보듯, 이 과정에서 클라이언트와 서버는 Client Hello, Server Hello, Certificate, Server Hello Done 메시지를 주고받는다. 이 과정을 거친 후에야 클라이언트와 서버는 본격적으로 데이터를 교환한다.

Wireshark에서 TLS handshake 이후 주고받는 패킷 중 아무거나 열어봤다.

![TLS로 내용이 암호화된 패킷.](/images/46820155-77ac5e00-cdc0-11e8-9193-8465aaddf255.webp)

클라이언트와 [https://www.ajou.ac.kr](https://www.ajou.ac.kr)가 주고받은 해당 패킷의 콘텐츠 타입이 Application Data라는 것을 제외하고는 정보를 알 수가 없다. HTTP로 접속할 때는 클라이언트가 요청한 리소스, 사용하는 브라우저, 유입 경로 등 패킷을 통해 각종 정보를 볼 수 있었지만, HTTPS로 접속할 때는 패킷이 암호화되어 내용을 알 수 없다.

만약 어떤 사람이 HTTP 서버에 접속했는데, 악의를 가진 해커가 그 사람의 패킷을 가로챈다면 그 사람이 어느 페이지에서 무엇을 했는지 모두 알아낼 수 있을 것이다.
