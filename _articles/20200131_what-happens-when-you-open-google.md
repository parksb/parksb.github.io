---
id: 36
title: "인터넷이 동작하는 아주 구체적인 원리"
subtitle: "학교에서 구글에 접속하는 과정"
date: "2020.01.27"
---

학교에서 노트북으로 구글(`www.google.com`)에 접속하는 과정을 살펴본다. 이 글에 등장하는 KT와 Google Fiber, 구글의 네트워크 구조, 노드의 IP 주소와 MAC 주소는 모두 간소화 또는 가정한 것이다. 또한 클라이언트와 서버가 패킷을 주고받는 전체 과정을 훑기 위해 프록시와 캐시는 생략했다.

학교 네트워크에는 여러 AP(Access Point)가 있고, AP들은 스위치에 연결되어 있다. 스위치들은 게이트웨이 라우터와 연결되어 있으며, 라우터는 SK브로드밴드나 KT와 같은 ISP(Internet Service Provider)의 네트워크에 연결되어 있다.

```
School network 68.80.2.0/24

        +----+   +--------+    /------\    +--------+
Node ---| AP |---| Switch |---| Router |---| Switch |--- ...
        +----+   +--------+    \------/    +--------+
          |           |            |
         ...         ...           |
                                   |
###################################|#################
KT network 68.80.0.0/13            |
                                   |
                               /------\
                       ... ---| Router |
                               \------/
                                   |
                                  ...
```

## Getting Started: WLAN, DHCP, UDP and IP

먼저 노트북을 켜고 AP(Access Point)를 검색한다. 가까운 AP들이 자신의 범위에 있는 모든 노드에게 비컨(Beacon) 프레임을 브로드캐스팅하며 자신의 존재를 알리고 있기 때문에 클라이언트는 AP 리스트를 확인하고 연결할 AP를 선택할 수 있다. 이렇게 AP가 신호를 보내는 방식을 패시브 스캐닝(Passive scanning)이라고 하며, 반대로 노드가 AP를 탐색하는 방식은 액티브 스캐닝(Active scanning)이라고 한다.

```
+-----------------+        +----------------+   +----+
| Client (Laptop) |<---+---| SSID: iptime01 |---| AP |
+-----------------+    |   | Security: WPA2 |   +----+
                       |   +----------------+
              Node <---+
                       |
              Node <---+
```

클라이언트가 `iptime01`을 선택하면 AP로 접속 요청 프레임을 전송한다. 요청 프레임을 받은 AP는 응답 프레임을 클라이언트에게 보내 연결을 마친다. 흔히 사용하는 Wi-Fi 통신이 이러한 [IEEE 802.11](http://www.ieee802.org/11/) 표준을 바탕으로 한다.

처음으로 학교 네트워크에 연결된 것이기 때문에 이 클라이언트에게는 아직 IP 주소가 없다. 이제 클라이언트에 IP 주소를 할당하기 위해 DHCP(Dynamic Host Configuration Protocol)가 동작한다. IP 할당을 서비스하는 DHCP 서버는 AP나 라우터에서 동작할 수 있다.

클라이언트의 운영체제가 클라이언트의 68번 포트에서 출발해 수신지의 67번 포트로 도착하는 DHCPD DISCOVER 메시지를 만든다. DHCP DISCOVER 메시지는 UDP로 전송될 것이다. 아직 클라이언트는 IP 주소를 할당받지 못한 상태이며, 클라이언트의 IP 주소가 없기 때문에 DHCP 메시지의 `src`, `yiaddr` 필드는 `0.0.0.0`이다. 또한 AP에 연결된 모든 노드에 메시지를 브로드캐스트할 것이므로 `dest` 필드는 `255.255.255.255`이다.

DHCP DISCOVER 메시지의 프레임은 수신지 MAC 주소(`FF:FF:FF:FF:FF:FF`)를 가지고 있으며, AP에 연결된 모든 장치에 브로드캐스트된다. 이때 프레임의 발신지 MAC 주소는 클라이언트의 MAC 주소(`00:16:D3:23:68:8A`)다.

```
+-------------------+   +---------------------------+    +----+
| Client (Laptop)   |---| src: 0.0.0.0, 68          |--->| AP | 68.85.2.9
| 00:16:D3:23:68:8A |   | dest: 255.255.255.255, 67 |    +----+ 00:1F:57:21:A8:3C
+-------------------+   | DHCPDISCOVER              |      |
                        | yiaddr: 0.0.0.0           |      +---> Node
                        | transaction ID: 654       |      |
                        +---------------------------+      +---> Node
```

AP가 DHCP 메시지를 받으면 클라이언트의 MAC 주소(`00:16:D3:23:68:8A`)와 IP 데이터그램을 프레임에서 추출한다. 데이터그램의 수신지 IP 주소는 상위 레이어에 의해 처리된다.

AP에서 동작하는 DHCP 서버는 CIDR(Classless Inter-Domain Routing) 블록의 IP 주소를 할당할 수 있다. 교내 네트워크에서 사용 중인 모든 IP 주소는 KT의 주소 블록에 속한 것이다. DHCP 서버는 클라이언트에 할당하기 위한 IP 주소(`68.85.2.101`)를 포함해 DHCP OFFER 메시지를 만든다. 이때 DHCP OFFER 메시지를 담아 클라이언트에게 UDP로 전송되는 프레임은 AP의 발신지 MAC 주소(`00:1F:57:21:A8:3C`)와 수신지 MAC 주소(`00:16:D3:23:68:8A`)를 가지고 있다.

```
+-------------------+    +---------------------------+   +----+
| Client (Laptop)   |<---| src: 68.85.2.9, 67        |---| AP | 68.85.2.9
| 00:16:D3:23:68:8A |    | dest: 255.255.255.255, 68 |   +----+ 00:1F:57:21:A8:3C
+-------------------+    | DHCPOFFER                 |
                         | yiaddr: 68.85.2.101       |
                         | transaction ID: 654       |
                         | DHCP server ID: 68.85.2.9 |
                         | Lifetime: 3600 secs       |
                         +---------------------------+
```

DHCP OFFER 응답을 받은 클라이언트는 DHCP OFFER의 값을 바탕으로 자신의 설정 값을 담아 DHCP REQUEST 메시지를 브로드캐스팅한다. 만약 여러 DHCP OFFER 메시지를 받았다면 그 중 하나를 선택한다.

```
+-------------------+   +---------------------------+    +----+
| Client (Laptop)   |---| src: 0.0.0.0, 68          |--->| AP | 68.85.2.9
| 00:16:D3:23:68:8A |   | dest: 255.255.255.255, 67 |    +----+ 00:1F:57:21:A8:3C
+-------------------+   | DHCPREQUEST               |      |
                        | yiaddr: 68.85.2.101       |      +---> Node
                        | transaction ID: 655       |      |
                        | DHCP server ID: 68.85.2.2 |      +---> Node
                        | Lifetime: 3600 secs       |
                        +---------------------------+
```

DHCP REQUEST를 받은 라우터는 DHCP ACK 메시지를 브로드캐스팅해 요청받은 설정 값을 승인한다.

```
+-------------------+        +---------------------------+   +----+
| Client (Laptop)   |<---+---| src: 68.85.2.9, 67        |---| AP | 68.85.2.9
| 68.85.2.101       |    |   | dest: 255.255.255.255, 68 |   +----+ 00:1F:57:21:A8:3C
| 00:16:D3:23:68:8A |    |   | DHCPACK                   |
+-------------------+    |   | yiaddr: 68.85.2.101       |
                         |   | transaction ID: 655       |
                Node <---+   | DHCP server ID: 68.85.2.9 |
                         |   | Lifetime: 3600 secs       |
                Node <---+   +---------------------------+
```

클라이언트는 DHCP ACK 메시지를 추출하고 자신의 IP 주소와 DNS 서버의 IP 주소를 기록한다. 이렇게 할당된 IP 주소는 기본적으로 임대한 것이기 때문에 일정 기간 사용하지 않으면 다시 반납되어 새로운 IP를 할당받아야 한다.

## Still Getting Started: Ethernet, DNS and ARP

클라이언트가 브라우저에서 `www.google.com`과 같은 URL을 입력하면 여러 과정을 거쳐 구글의 홈페이지가 클라이언트의 브라우저에 보여질 것이다. 그전에 클라이언트는 `www.google.com`의 IP 주소를 알아내야 한다. 이때 도메인 네임을 IP 주소로 변환하기 위해 DNS 프로토콜이 사용된다.

DNS 쿼리를 위해 클라이언트는 DNS 쿼리 메시지를 담은 프레임을 교내 네트워크에 있는 로컬 DNS 서버에 보낼 것이다. DNS 서버는 라우터에서 동작할 수도 있는데, 이 경우에는 별도의 로컬 DNS 서버가 운영되고 있다.

로컬 DNS 서버가 없는 경우에는 ISP의 DNS 서버로 전송한다. 그런 경우 만약 ISP가 특정 사이트에 대한 접속을 차단하고자 한다면 요청 받은 도메인 네임의 IP 주소가 아닌 `warning.or.kr`의 IP 주소를 응답해줄 수 있다.

현재 클라이언트는 로컬 DNS 서버의 MAC 주소를 모른다. 이를 알아내기 위해 ARP(Address Resolution Protocol)를 사용한다.

클라이언트가 로컬 DNS 서버의 IP 주소와 함께 ARP 쿼리 메시지를 만든다. ARP 메시지는 AP로 전송되며, AP에 이더넷(Ethernet)으로 연결된 스위치로도 브로드캐스팅된다. 스위치 역시 로컬 DNS 서버의 MAC 주소를 모르기 때문에 자신에게 연결된 모든 장비에 프레임을 전송한다. 이더넷은 유선 LAN(Local Area Network)을 구성하기 위한 통신 표준이며, [IEEE 802.3](http://www.ieee802.org/3/)으로 정의되어 있다.

```
+-------------------+   +------------------------------+    +----+    +--------+     /------\
| Client (Laptop)   |---| Sender HA: 00-16-D3-23-68-8A |--->| AP |--->| Switch |--->| Router | 68.85.2.1
| 68.85.2.101       |   | Sender IP: 68.85.2.101       |    +----+    +--------+     \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |   | Target HA: 00-00-00-00-00-00 |                |    |
+-------------------+   | Target IP: 68.85.2.2         |                |    |     +------------------+
                        +------------------------------+                |    +---->| Local DNS Server | 68.85.2.2
                                                                        |          +------------------+
                                                                        |
                                                                        +---------> Node
```

로컬 DNS 서버의 MAC 주소를 모르기 때문에 `Target HA` 필드의 값은 `00-00-00-00-00-00`으로 설정된다.

로컬 DNS 서버가 ARP 쿼리 메시지를 포함한 프레임을 받으면 자신의 MAC 주소를 담아 ARP 응답을 준비한다. ARP 응답 메시지는 수신지 주소와 함께 이더넷 프레임에 담기며, 프레임은 스위치로 전송된다. 이어서 스위치는 클라이언트에 프레임을 전송한다.

```
+-------------------+    +----+    +--------+    +------------------------------+   +------------------+
| Client (Laptop)   |<---| AP |<---| Switch |<---| Sender HA: 00-16-D3-23-68-8A |---| Local DNS Server | 68.85.2.2
| 68.85.2.101       |    +----+    +--------+    | Sender IP: 68.85.2.101       |   +------------------+ 00:07:89:1C:43:2F
| 00:16:D3:23:68:8A |                            | Target HA: 00:07:89:1C:43:2F |
+-------------------+                            | Target IP: 68.85.2.2         |
                                                 +------------------------------+
```

클라이언트가 ARP 응답 메시지를 담은 프레임을 받고, ARP 응답 메시지에서 로컬 DNS 서버의 MAC 주소(`00:07:89:1C:43:2F`)를 추출한다. 이제 클라이언트가 로컬 DNS 서버의 MAC 주소를 알게 되었으므로 DNS 쿼리 메시지를 보낼 수 있다.

클라이언트의 운영체제는 DNS 쿼리 메시지를 만들고 메시지의 질의 섹션에 `www.google.com` 문자열을 넣는다. DNS 메시지에 이어 로컬 DNS 서버의 53포트로 향하는 UDP 세그먼트와 IP 데이터그램이 붙여진다. 이 프레임의 IP 데이터그램은 수신지 IP 주소를 가지고 있다. 클라이언트는 프레임을 AP로 보내고 AP는 스위치로 프레임을 전달한다. 스위치는 자신에게 연결된 로컬 DNS 서버에게 프레임을 전송한다.

```
+-------------------+   +---------------------------------------+    +----+    +--------+    +------------------+
| Client (Laptop)   |---| Identification, Flags (OP, Query type,|--->| AP |--->| Switch |--->| Local DNS Server | 68.85.2.2
| 68.85.2.101       |   | AA, TC, RD, RA, Response Type)        |    +----+    +--------+    +------------------+ 00:07:89:1C:43:2F
| 00:16:D3:23:68:8A |   | Questions (Query name, type, class )  |
+-------------------+   | Answers, Authority, Additional Info   |
                        +---------------------------------------+
```

## Still Getting Stated: Intra-Domain Routing to the DNS Server

로컬 DNS 서버는 DNS 쿼리 메시지를 보고 `www.google.com`의 IP 주소를 찾는다. 로컬 DNS 서버가 해당 IP 주소를 알고 있으면 클라이언트에게 바로 응답을 줄 수 있다. 하지만 지금 로컬 DNS 서버는 `www.google.com`의 IP 주소를 모르기 때문에 루트 DNS 서버에 DNS 쿼리를 전송할 것이다. 루트 DNS 서버는 전세계에 13대 뿐이며, 한국을 비롯한 다양한 나라에 미러 서버가 운영되고 있다.

루트 DNS 서버는 외부 네트워크에 있기 때문에 게이트웨이 라우터를 통과해야한다. 이때 클라이언트는 라우터의 MAC 주소를 모르기 때문에 ARP를 사용해 앞서 로컬 DNS 서버의 MAC 주소를 알아낼 때와 같은 과정을 거친다.

```
+-------------------+   +------------------------------+    +--------+     /------\
| Local DNS Server  |---| Sender HA: 00:07:89:1C:43:2F |--->| Switch |--->| Router | 68.85.2.1
| 68.85.2.2         |   | Sender IP: 68.85.2.2         |    +--------+     \------/  00:22:6B:45:1F:1B
| 00:07:89:1C:43:2F |   | Target HA: 00-00-00-00-00-00 |      |    |
+-------------------+   | Target IP: 68.85.2.1         |      |    |
                        +------------------------------+      |    +-----> Node
                                                              |
                                                              |
                                                              +----------> Node
```

라우터는 프레임을 받고 DNS 쿼리를 담은 IP 데이터그램을 추출한 뒤, 데이터그램의 수신지 주소를 보고 포워딩 테이블에 따라 데이터그램을 보내야할 KT 네트워크의 라우터를 결정한다. IP 데이터그램은 링크 레이어 프레임에 담겨 있으며, 학교의 라우터와 KT 라우터 사이의 링크를 통해 프레임이 전송된다.

KT 네트워크의 라우터는 프레임을 받은 뒤 IP 데이터그램을 추출해 수신지의 IP 주소를 확인한다. 이어서 자신의 DNS 서버에서 요청받은 `www.google.com`에 대응하는 IP 주소를 찾는다.

```
School network 68.80.2.0/24

+-------------------+    +--------+     /------\
| Local DNS Server  |<-->| Switch |<-->| Router | 68.85.2.1
| 68.85.2.2         |    +--------+     \------/  00:22:6B:45:1F:1B
| 00:07:89:1C:43:2F |                       ^
+-------------------+                       |
                                            |
############################################|#####
KT network 68.80.0.0/13                     |
                                            v
                  +---------------+     /-------\
                  | KT DNS Server |<-->| Routers |
                  +---------------+     \-------/
```

만약 KT 자신의 DNS 서버에 일치하는 레코드가 없다면 루트 DNS 서버에게 요청을 보내야 한다. 먼저 출력 인터페이스를 결정하고, 루트 DNS 서버의 네트워크로 DNS 쿼리 프레임을 보낸다. DNS 쿼리 프레임을 받은 루트 DNS 서버는 쿼리 메시지를 추출해 `www.google.com`의 TLD(Top-Level Domain)가 `.com`인 것을 보고 `com` TLD 서버의 IP 주소를 응답한다.

```
School network 68.80.2.0/24

+-------------------+    +--------+     /------\
| Local DNS Server  |<-->| Switch |<-->| Router | 68.85.2.1
| 68.85.2.2         |    +--------+     \------/  00:22:6B:45:1F:1B
| 00:07:89:1C:43:2F |                       ^
+-------------------+                       |
                                            |
############################################|#####
KT network 68.80.0.0/13                     |
                                            v
                                        /-------\
                                       | Routers |
                                        \-------/
                                            ^
                                            |
############################################|#####
Root DNS Server network                     |
                                            v
                +-----------------+     /-------\
                | Root DNS Server |<-->| Routers |
                +-----------------+     \-------/
```

응답을 받은 로컬 DNS 서버는 `com` TLD 서버에 DNS 쿼리를 보낸다. `com` TLD 서버는 IP 주소를 담은 DNS 리소스 레코드를 찾는다. TLD 서버도 `www.google.com`의 IP 주소를 모른다면 구글의 네임서버 IP를 응답한다.

```
School network 68.80.2.0/24

+-------------------+    +--------+     /------\
| Local DNS Server  |<-->| Switch |<-->| Router | 68.85.2.1
| 68.85.2.2         |    +--------+     \------/  00:22:6B:45:1F:1B
| 00:07:89:1C:43:2F |                       ^
+-------------------+                       |
                                            |
############################################|#####
KT network 68.80.0.0/13                    ...
############################################|#####
TLD DNS Server network                      |
                                            v
             +--------------------+     /-------\
             | com TLD DNS Server |<-->| Routers |
             +--------------------+     \-------/
```

구글 네임서버는 호스트네임을 IP 주소로 매핑한 데이터를 담아 `www.google.com`의 IP 주소를 응답한다. 구글의 서버는 해외에 있기 때문에 KT 네트워크에 연결된 해저 케이블을 타고 구글 서버가 위치한 국가의 ISP 망을 거쳐야 한다. ([TeleGeography Submarine Cable Map](https://www.submarinecablemap.com/)에서 해저 케이블 지도를 볼 수 있다.) 미국에는 AT&T, Comcast 등의 ISP가 있으며, 구글은 직접 운영하는 ISP인 Google Fiber의  네트워크를 사용한다.

```
School network 68.80.2.0/24

+-------------------+    +--------+     /------\
| Local DNS Server  |<-->| Switch |<-->| Router | 68.85.2.1
| 68.85.2.2         |    +--------+     \------/  00:22:6B:45:1F:1B
| 00:07:89:1C:43:2F |                       ^
+-------------------+                       |
                                            |
############################################|#####
KT network 68.80.0.0/13                    ...
############################################|#####
Google Fiber network 172.80.0.0/13         ...
############################################|#####
Google network 172.217.20.0/19              |
                                            v
               +------------------+     /-------\
               | Auth. DNS Server |<-->| Routers |
               +------------------+     \-------/
```

클라이언트는 DNS 메시지에서 `www.google.com`의 IP 주소를 추출한다. 이제 클라이언트는 `www.google.com` 서버를 만날 준비가 되었다.

## Web Client-Server Interaction: TCP and HTTP

클라이언트는 HTTP GET 메시지를 보내기 위해 TCP 소켓을 만든다. 먼저 three-way handshake를 거쳐 `www.google.com`과 TCP 연결을 구축해야 한다. 클라이언트가 먼저 TCP SYN 세그먼트를 만들어 수신지 포트를 80 포트(HTTP)로 설정하고, 스위치에 프레임을 전송한다. 이때 프레임은 수신지 MAC 주소(`00:22:6B:45:1F:1B`)를 가지고 있다.

학교, KT, Google Fiber, 구글 네트워크의 라우터는 각자의 포워딩 테이블을 보고 TCP SYN을 담은 데이터그램을 `www.google.com` 웹서버로 보낸다. ISP의 네트워크와 구글의 네트워크 사이에 있는 도메인 내 링크를 통해 전달되는 패킷들은 BGP(Border Gateway Protocol)에 따라 통제된다.

실제 구글 네트워크는 방화벽이나 로드밸런서, API 게이트웨이 등으로 더 복잡하게 구성되어 있겠지만 구글의 네트워크 아키텍쳐는 여기서 다루고자하는 핵심이 아니므로 간소화했다.

```
School network 68.80.2.0/24

+-------------------+   +------------+    +----+    +--------+     /------\
| Client (Laptop)   |---| Seq Num: 1 |--->| AP |--->| Switch |--->| Router | 68.85.2.1
| 68.85.2.101       |   | SYN        |    +----+    +--------+     \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |   +------------+                                 |
+-------------------+                                                  |
#######################################################################|#####
KT network 68.80.0.0/13                                               ...
#######################################################################|#####
Google Fiber network 172.80.0.0/13                                    ...
#######################################################################|#####
Google network 172.217.20.0/19                                         |
                                                                       v
                                            +----------------+     /-------\
                                            | Web Server     |<---| Routers |
                                            | 172.217.25.228 |     \-------/
                                            +----------------+
```

`www.google.com`에 도달한 SYN 메시지는 데이터그램에서 추출되고, 80 포트로 디멀티플렉스(Demultiplex)된다. 구글 HTTP 서버는 클라이언트와의 TCP 연결을 위해 연결 소켓을 생성하며, 이어서 TCP SYNACK 세그먼트가 생성되면 클라이언트에 전송한다.

```
School network 68.80.2.0/24

+-------------------+    +----+    +--------+     /------\
| Client (Laptop)   |<---| AP |<---| Switch |<---| Router | 68.85.2.1
| 68.85.2.101       |    +----+    +--------+     \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |                                 ^
+-------------------+                                 |
                                                      |
######################################################|#####
KT network 68.80.0.0/13                              ...
######################################################|#####
Google Fiber network 172.80.0.0/13                   ...
######################################################|#####
Google network 172.217.20.0/19                        |
                                                      |
          +----------------+   +------------+     /-------\
          | Web Server     |---| Seq Num: 5 |--->| Routers |
          | 172.217.25.228 |   | Ack Num: 2 |     \-------/
          +----------------+   | SYNACK     |
                               +------------+
```

TCP SYNACK 세그먼트를 담은 데이터그램이 클라이언트에 도착한다. 데이터그램은 운영체제에서 디멀티플렉스되어 앞서 만들어진 TCP 소켓으로 간다. SYNACK 세그먼트를 받은 클라이언트는 TCP ACK 응답을 보내 TCP 연결을 구축한다.

```
School network 68.80.2.0/24

+-------------------+   +------------+    +----+    +--------+     /------\
| Client (Laptop)   |---| Seq Num: 2 |--->| AP |--->| Switch |--->| Router | 68.85.2.1
| 68.85.2.101       |   | Ack Num: 6 |    +----+    +--------+     \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |   | ACK        |                                 |
+-------------------+   +------------+                                 |
                                                                       |
#######################################################################|#####
KT network 68.80.0.0/13                                               ...
#######################################################################|#####
Google Fiber network 172.80.0.0/13                                    ...
#######################################################################|#####
Google network 172.217.20.0/19                                         |
                                                                       v
                                            +----------------+     /-------\
                                            | Web Server     |<---| Routers |
                                            | 172.217.25.228 |     \-------/
                                            +----------------+
```

구글 웹 서버는 HTTPS 통신을 하므로 TLS handshake 과정도 거쳐야한다. 먼저 클라이언트가 클라이언트 랜덤(Client random) 문자열을 생성하고 ClientHello 메시지에 담아 서버에게 보낸다. ClientHello를 받은 서버는 SSL 인증서와 서버 랜덤(Server random) 문자열을 ServerHello 메시지에 담아 클라이언트에게 응답한다.

클라이언트는 서버로부터 받은 SSL 인증서의 유효성을 검증해 현재 연결된 서버가 실제로 `www.google.com`의 소유자라는 것을 확인하고 서버에게 공개키로 암호화한 랜덤 문자열을 보낸다. 이 문자열은 프리마스터 시크릿(Premaster secret)이라고 부르며, 구글 서버의 비밀키로만 복호화할 수 있다.

서버는 클라이언트로부터 프리마스터 시크릿을 받고 이를 자신의 비밀키로 복호화한다. 서버와 클라이언트는 각자 서버 램덤, 클라이언트 랜덤, 프리마스터 시크릿을 이용해 세션 키(Session key)를 생성한다. 서버의 세션 키와 클라이언트의 세션 키는 동일해야 한다.

마지막으로 클라이언트와 서버가 세션 키로 암호화된 Finished 메시지를 주고 받으며 TLS handshake를 마친다. 이제 클라이언트와 서버는 세션 키를 이용해 대칭키 방식으로 TLS 통신을 할 수 있다.

클라이언트의 소켓은 `www.google.com`으로 데이터를 보낼 준비가 되었다. 클라이언트의 브라우저는 HTTP GET 메시지를 만들고 URL을 담는다. HTTP GET 메시지는 소켓에 쓰여 TCP 세그먼트의 페이로드가 된다. TCP 세그먼트는 데이터그램에 담기고 `www.google.com`으로 전송된다. 실제로 패킷 캡쳐를 해보면 TLS로 암호되어 내용을 확인할 수 없다. ([HTTPS는 어떻게 다를까?](https://parksb.github.io/article/24.html) 참고)

```
School network 68.80.2.0/24

+-------------------+   +----------------------+    +----+    +--------+     /------\
| Client (Laptop)   |---| GET / HTTP/2         |--->| AP |--->| Switch |--->| Router | 68.85.2.1
| 68.85.2.101       |   | Host: www.google.com |    +----+    +--------+     \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |   | ...                  |                                 |
+-------------------+   +----------------------+                                 |
                                                                                 |
#################################################################################|#####
KT network 68.80.0.0/13                                                         ...
#################################################################################|#####
Google Fiber network 172.80.0.0/13                                              ...
#################################################################################|#####
Google network 172.217.20.0/19                                                   |
                                                                                 v
                                                      +----------------+     /-------\
                                                      | Web Server     |<---| Routers |
                                                      | 172.217.25.228 |     \-------/
                                                      +----------------+
```

`www.google.com`의 HTTP 서버는 TCP 소켓에서 HTTP GET 메시지를 읽고, HTTP 응답 메시지를 만든다. HTTP 응답 메시지의 body에 요청받은 콘텐츠를 담아 TCP 소켓으로 전송한다.

HTTP 응답 메시지를 담은 데이터그램은 학교 네트워크로 향하고, 클라이언트에 도달한다. 클라이언트의 브라우저는 소켓의 HTTP 응답 메시지를 읽고 body에서 html을 추출해 웹페이지를 렌더링해준다.

```
School network 68.80.2.0/24

+-------------------+     +----+     +--------+      /------\
| Client (Laptop)   |<----| AP |<----| Switch |<----| Router | 68.85.2.1
| 68.85.2.101       |     +----+     +--------+      \------/  00:22:6B:45:1F:1B
| 00:16:D3:23:68:8A |                                    ^
+-------------------+                                    |
                                                         |
#########################################################|#####
KT network 68.80.0.0/13                                 ...
#########################################################|#####
Google Fiber network 172.80.0.0/13                      ...
#########################################################|#####
Google network 172.217.20.0/19                           |
                                                         |
+----------------+   +-------------------------+     /-------\
| Web Server     |---| HTTP/2 200 OK           |--->| Routers |
| 172.217.25.228 |   | Content-Type: text/html |     \-------/
+----------------+   | ...                     |
                     | <html>...</html>        |
                     +-------------------------+
```

드디어 클라이언트의 브라우저 화면에 구글이 보여진다.

## References

* J. K. Kurose, K. W. Ross, "Computer Networking: A Top-Down Approach 7th ed.", Pearson, 2016.
<!-- markdown-link-check-disable-next-line -->
* ["What Happens in a TLS Handshake?"](https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/), Cloudflare.
