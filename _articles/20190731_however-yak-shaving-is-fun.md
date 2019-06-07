---
id: 32
title: "하지만, 야크 털 깎기는 재미있다"
subtitle: "밑바닥부터 만드는 즐거움"
date: "2019.7.31"
tags: "개발방법론"
---

![야크.](https://user-images.githubusercontent.com/6410412/60662976-d78bed00-9e98-11e9-9832-908c731a6989.jpg)

이 블로그는 [지킬](https://jekyllrb.com/)이나 [휴고](https://gohugo.io/), [개츠비](https://www.gatsbyjs.org/)같은 정적 사이트 생성기/프레임워크를 사용하지 않았다. 처음엔 이것저것 써봤지만 커스터마이징 자유도가 낮아서 직접 블로그를 만들기로 했다. 초기에는 간단히 html로 글을 썼는데, 너무 불편해서 json 파일로 글을 쓰는 시스템을 만들었다. 이것도 장문의 글을 쓰기엔 불편해서 마크다운 파일을 html 파일로 변환하는 서비스를 개발했다. 그 다음엔 결과물로 나온 파일들을 빌드, 배포하기 위한 툴을 만들었다. 결국 [밑바닥부터 정적 사이트 생성기를 만든 셈이 됐다.](https://github.com/ParkSB/parksb.github.io-develop)

이러한 작업을 [야크 털 깎기(Yak shaving)](https://projects.csail.mit.edu/gsb/old-archive/gsb-archive/gsb2000-02-11.html)라고 한다. 야크 털 깎기는 MIT AI Lab에서 박사과정을 밟던 대학원생 칼린 비에리(Carlin Vieri)가 만든 용어로, 목표한 일 하나를 위해 연관된 작업들을 하다가 결국 원래 목적을 잃고 완전히 관련없는 작업을 하게 되는 것을 말한다. [LengDev IRC 채널에서 나온 예시](http://blog.dahlia.pe.kr/articles/2009/09/11/yak-shaving)를 보면 왜 야크 털 깎기라고 하는지 이해된다.

1. 나무를 베기 위해 도끼를 구했다.
1. 도끼날이 너무 무뎌 날을 갈기 위한 돌을 구하려 한다.
1. 그런데 어떤 마을에 정말 좋은 돌이 있다는 이야기를 듣는다.
1. 그 마을에 가기 위해 야크를 구한다.
1. 야크 털이 너무 길어서 털을 깎기 시작한다.

기업가이자 마케터, 작가인 [세스 고딘(Seth Godin)의 예시](https://seths.blog/2005/03/dont_shave_that/)도 있다.

1. "오늘은 세차를 해야겠어."
1. "이런, 호스가 망가졌네. 홈디포에서 새 호스를 사야겠군."
1. "하지만 홈디포는 태펀지 다리 건너편에 있지. 톨게이트를 지나야 하니까 이지패스가 필요해."
1. "잠깐! 이웃에게 이지패스를 빌릴 수 있을 것 같은데..."
1. "그렇지만 밥은 내 아들이 빌린 베개를 돌려주기 전까지 이지패스를 빌려주지 않을거야."
1. "베개의 야크 털이 많이 빠져서 그냥 돌려줄 수 없네. 야크 털을 다시 채워야겠어."
1. 결국 세차를 하기 위해 동물원에서 야크 털을 깎기 시작한다.

두 이야기는 야크 털 깎기라는 용어가 만들어진 다음에 나온 것이고, 실제 용어가 탄생한 계기는 따로 있다. 당시 화요일 밤 늦게까지 하키를 한 칼린 비에리는 한밤중에 저녁을 먹으며 TV를 봤다. 그때 TV에는 애니메이션 렌과 스팀피(The Ren & Stimpy Show)의 야크 털 깎기의 날(Yak shaving day) 에피소드가 나오고 있었다. 그 줄거리는 이렇다:

> 5일 뒤면 야크 털 깎기의 날이 온다. 렌과 스팀피는 더러운 기저귀를 벽에 걸고, 부츠에 코울슬로를 부어 집을 꾸민다. 그리고 제모한 야크가 마법의 카약을 타고 날아와 선물을 주길 기도하며 화장실 세면대에 면도 크림과 면도기를 둔다. 그날 밤, 야크가 욕조 배수구에서 나와 면도를 하고 세면대에 선물을 남긴 채 떠난다. 바로 야크가 면도하며 사용한 크림 찌꺼기다.[^1]

칼린 비에리는 이 내용을 이상하게 생각했다. 며칠 뒤 밤새 서류 작업(관리인에게 허락을 받고, DHL 계정을 만들고, 우체국을 찾는 등 짜증나는 일들)을 할 때 동료에게 자신이 야크 털 깎기를 하고 있다고 말했다. 그리고 이후 몇 달간 연구실 사람들에게 야크 털 깎기라는 말을 사용하며 용어가 알려졌다.[^2] 애니메이션 내용이 워낙 괴상하고, 소프트웨어와도 별로 관련이 없어서 유래는 많이 알려진 것 같지 않다.

엔지니어가 (또는 엔지니어링팀을 운영하는 경영진이) 많이 하는 실수 중 하나가 '밑바닥부터 만들기'다. 엔지니어는 시중의 솔루션이 딱 마음에 들지 않을 수도 있고, 자신의 실력을 증명하고 싶어 할 수도 있다. 클라이언트나 경영진은 [기존 솔루션에 대한 잘못된 이해](https://edykim.com/ko/post/you-used-open-source-and-are-you-a-developer/)가 있을 수도 있고, 기존 솔루션이 요구 사항을 정확히 만족하지 못한다고 생각할 수도 있다. 

프로덕션이든 토이 프로젝트든, 대부분의 프로젝트에는 한정된 예산과 시간이 있다. 밑바닥부터 만들다보면 결국 야크 털을 깎게 되고, 야크 털을 깎기 시작하면 끝이 어딘지 종잡을 수 없게 된다. 그리고 결국 초기 목표를 포기하게 된다. 이런 경우엔 요구 사항의 핵심을 만족시킬 수 있는 대안을 찾아 작업량을 최대한 줄이는 것이 맞다.

하지만, 야크 털 깎기는 재미있다.

야크 털 깎기는 본질적으로 재밌을 수 밖에 없다. 세상에 없던 무언가를 만드는 행위, 문제를 발견하고 해결하는 행위, 원리를 알기 위해 연쇄적인 지식을 파고드는 행위, 모두 엔지니어를 이끈다. 애초에 '내가 원하는 것을 내가 직접 만든다'는 것은 꼭 엔지니어가 아니더라도 흥미로울만 하다.

TeX도 야크의 털을 깎아 태어났다. TeX은 스탠퍼드 대학교 교수 도널드 커누스(Donald Knuth)가 만든 조판 시스템으로, 조판 언어와 언어를 처리하는 컴파일러를 비롯해 프로그램을 운영하는 시스템 전체를 말한다.[^3] 수식을 입력하기 편해서 사회과학 분야나 이공계 분야에서 널리 사용된다. (TeX을 쉽게 사용하기 위한 매크로인 [LaTeX](https://www.latex-project.org/)이 많이 쓰인다.)

가령 TeX 문법으로 아래와 같이 작성하면:

```
-b \pm \sqrt{b^2 - 4ac} \over 2a
```

이렇게 예쁘게 출력된다:

```math
-b \pm \sqrt{b^2 - 4ac} \over 2a
```

1976년, 도널드 커누스는 컴퓨터 프로그래밍의 예술 2권 2판(The Art of Computer Programming Volume 2: Seminumerical Algorithms, 2nd Edition)을 준비하고 있었다. 그는 1판에서 사용한 것과 같은 타입셋인 핫 타입(Hot type)을 쓰려했으나, 더 이상 핫 타입은 사용할 수 없었다. 다른 타입셋에는 만족할 수 없었던 도널드 커누스는 같은 시기 디지털 조판된 패트릭 윈스턴(Patrick Winston)의 새 책을 보게 되었고, 여기에 고무되어 직접 디지털 조판 시스템을 만들기로 결심, TeX의 기본 기능을 구상했다.[^4]

도널드 커누스는 SAIL 언어로 TeX의 첫 버전을 만들었고, 이후에 자신이 직접 만든 프로그래밍 언어인 WEB으로 개발해 완성했다.[^5] WEB 소스는 문서와 코드가 섞인 형태이며, WEB 파일의 문서와 코드는 각각 위브(Weave)와 탱글(Tangle)이라는 프로그램을 통해 TeX 파일과 파스칼 파일로 추출할 수 있다. 그는 이러한 프로그래밍 패러다임을 [문학적 프로그래밍(Literate programming)](http://www.literateprogramming.com/knuthweb.pdf)이라고 불렀다. 또한 도널드 커누스는 마이클 플래스(Michael Plass)와 함께 문장의 어느 지점에서 줄 바꿈을 할지 결정하는 [Knuth-Plass line wrapping 알고리즘](https://www.students.cs.ubc.ca/~cs-490/2015W2/lectures/Knuth.pdf)을 고안했다. 뿐만 아니라 TeX을 위한 폰트인 컴퓨터 모던(Computer Modern)을 디자인했고, 벡터 그래픽을 정의하기 위한 언어 METAFONT를 만들었다. 더불어 장치에 종속되지 않고 TeX을 출력하기 위해 DVI(Device Independent) 포맷까지 개발했다.[^6]

결과적으로 도널드 커누스는 책을 쓰기 위해 프로그래밍 언어와 패러다임, 알고리즘, 도구, 서체를 만들어냈다. TeX을 만드는데 10년 가까운 시간이 걸렸고, 책도 그만큼 늦게 출간됐다. 그러나 헛된 시도는 아니었다.

물론 이건 극단적으로 성공적인 경우고, 대부분의 야크 털 깎기는 실패한다. 적절한 지점에서 중단해야 하는데,[^7] 털을 깎기 시작하면 그 동안 쏟은 시간이 아까워서, 또는 그것 자체가 즐거워서 끊기 쉽지 않다. 아니면 진짜로 끝까지 가야하는데, 결국 '내가 지금 뭐하는거지'라는 생각이 들며 흥미가 떨어지거나 프로젝트에 주어진 자원이 바닥날 때 그만두게 된다.

한편 뭔가를 공부하는 입장에선 야크 털 깎기가 굉장히 효과적이라고 생각한다. 대부분의 CS 전공 과제는 교수의 의도와 상관없이 어느정도 야크 털 깎기를 요구하는데, 과제의 주요 지시 사항보다 그것과 연관된 지식을 파고 들면서 더 많은 것을 얻을 때도 있다. 반대로 말하자면, 야크 털 깎기를 하면 분명 뭔가 배우는 것이 있다. 가령 컴퓨팅 시스템을 야크 털 깎듯이 만들겠다면 불 논리부터 논리회로, 컴퓨터 아키텍처, 프로그래밍 언어, 운영체제를 공부해야 한다. 노암 니산(Noam Nisan)과 시몬 쇼켄(Shimon Schocken)의 [밑바닥부터 만드는 컴퓨팅 시스템](https://blog.insightbook.co.kr/2019/03/29/%EB%B0%91%EB%B0%94%EB%8B%A5%EB%B6%80%ED%84%B0-%EB%A7%8C%EB%93%9C%EB%8A%94-%EC%BB%B4%ED%93%A8%ED%8C%85-%EC%8B%9C%EC%8A%A4%ED%85%9C/)이 이런 과정을 담고있다. 그러니까 끝을 보지 못하더라도 야크 털을 깎으며 배운 것이 있다면 그 자체로 의미가 있다(고 믿고 싶다).

아무튼 야크 털 깎기는 재미있다.

[^1]: [DeadPark, "Ren and Stimpy: The Quest for the Shaven Yak".](http://www.deadpark.com/articles/ren-and-stimpy-the-quest-for-the-shaven-yak/)
[^2]: [Donavon West, "Yak Shaving: A Short Lesson on Staying Focused", American Express, 2018.](https://americanexpress.io/yak-shaving/)
[^3]: [KTUG, "KTUGFaq: TeX", 2009.](http://faq.ktug.org/faq/TeX)
[^4]: [TUG, "History of TeX, 2019.](https://www.tug.org/whatis.html)
[^5]: [권현우 외 15명, "TeX: 조판, 그 이상의 가능성", _KTS 설립 10주년 기념문집_, 한국텍학회, 경문사, 314쪽, 2017.](http://conf.ktug.org/2017/doc/KTS%EC%84%A4%EB%A6%BD10%EC%A3%BC%EB%85%84%EA%B8%B0%EB%85%90%EB%AC%B8%EC%A7%91_%EC%B5%9C%EC%A2%85%EB%B3%B8_20170213.pdf)
[^6]: [Florian Gilcher, "Donald Knuth - The Patron Saint of Yak Shaves", 2017.](https://yakshav.es/the-patron-saint-of-yakshaves/)
[^7]: [item4, "성공적인 Yak Shaving, 실패하는 Yak Shaving", 2015.](https://item4.github.io/2015-07-27/Successful-Yak-Shaving-Unsuccessful-Yak-Shaving/)