---
title: "Rust 커맨드라인 애플리케이션 (번역)"
subtitle: "러스트를 이용해 커맨드라인 애플리케이션을 개발하는 방법"
thumbnail: "/images/0747813d-dd75-4fbb-a5d9-a87c592fa8f8.webp"
---

![](/images/0747813d-dd75-4fbb-a5d9-a87c592fa8f8.webp)

**Rust 커맨드라인 애플리케이션 (2023) [github.com/parksb/rust-cli-book-ko-kr](https://github.com/parksb/rust-cli-book-ko-kr)**

Command Line Applications in Rust는 범용 프로그래밍 언어 러스트(Rust)를 이용해 커맨드라인 애플리케이션을 개발하는 방법에 대해 소개하는 책이다. 독자는 간단한 CLI 애플리케이션을 만들며 러스트의 핵심 개념과 타입 시스템, 툴 체인, 에코시스템을 익히게 된다.

러스트는 높은 성능과 안전성을 확보하기 위한 정적 컴파일 언어로, 모질라 재단에서 독립한 Rust Foundation이 메인테이닝하는 [오픈소스](https://github.com/rust-lang/rust) 프로젝트이다. 러스트는 [Stackoverflow Survey](https://survey.stackoverflow.co/2022/#most-loved-dreaded-and-wanted-language-love-dread)에서 매년 연속으로 "가장 사랑받는 언어"이자, "가장 배우고 싶은 언어" 1위로 선정되고 있다. 이처럼 러스트의 가능성은 충분히 인정받고 있지만, 오너십(Ownership)이라는 특유의 메모리 관리 방식이 큰 러닝커브로 작용하여 배우기 어려운 언어로도 알려져 있다. 이 때문인지 실제 업무에 러스트를 사용하고 있다고 응답한 비율은 순위권에 든 적이 없다.

하지만 러스트는 확실히 실용적인 언어다. 러스트의 메모리 관리 방식은 코드 레벨에서 메모리 세이프티를 강제하기 때문에 런타임에 발생할 수 있는 세그먼트 폴트 등의 문제를 컴파일 타임에 방지할 수 있다. 또한 러스트에는 GC가 없기 때문에 C/C++에 상당하는 성능을 달성할 수 있으며, 이러한 측면에서 C/C++로 작성된 코드베이스를 메모리 세이프하게 개선하기 위한 가장 현실적인 방안으로 주목받고 있다. 실제로 마이크로소프트, 구글, 애플, 클라우드플레어, 삼성 등 많은 기업이 이미 러스트를 후원, 사용하고 있다. 최근에는 리눅스 커널에 러스트 코드가 포함되기도 했고, 많은 CLI 도구가 러스트로 다시 작성되고 있다.

Command Line Applications in Rust는 러스트 코어팀의 CLI Working Group에서 공식적으로 작성한 책이기 때문에 매우 정확한 설명을 포함하고 있고, 그 내용도 상당한 공신력이 있다. 하지만 책의 훌륭한 내용에 비해 사람들에게 잘 알려지지는 않았고, 언어도 영문과 중문으로만 제공되고 있다. 러스트의 문법이나 개념, 입문자를 위한 튜토리얼 자료는 많지만, 러스트를 이용한 애플리케이션 개발에 대해 밀도 높게 다루는 문서는 많지 않다. 심지어 한국어 문서는 더욱 찾기 어렵기 때문에, 러스트 문서를 한국어로 번역하는 기여가 필요하다. Command Line Applications in Rust의 한국어 번역본을 통해 더 많은 한국 개발자들이 러스트를 접하고, 러스트의 문제의식과 철학에 공감해 주길 기대한다. 특히 러스트의 대략적인 문법과 개념은 살펴봤지만, 아직 완결된 프로그램을 만들어 보지 못한 사람들이 Command Line Applications in Rust로 시작해 보면 좋을 것 같다.