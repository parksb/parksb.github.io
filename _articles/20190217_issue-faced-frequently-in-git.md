---
id: 28
title: "Git 사용 중 자주 만나는 이슈 정리"
subtitle: "코딩보다 어려운 버전 관리"
date: "2019.2.17"
---

깃으로 버전 관리를 하다보면 각종 이슈가 자주 발목을 잡는다. 특히 복잡한 프로젝트의 경우 그 정도가 심한데... 입사 이후 '지금까지 내가 한 건 깃이 아니구나'를 깨닫고 더 공부해 보기로 했다. 그러다보니 매번 비슷한 문제 상황을 마주하게 되는 것 같아서 케이스별로 정리해보았다.

먼저 아주 간단한 예시로 주요 용어를 살펴보면:

```
            -add->      -commit->     -push->
+-------------+-------------+------------+-------------+
| Working dir |    Index    | Local repo | Remote repo |
+-------------+-------------+------------+-------------+
         <-checkout-                 <-fetch-
```

1. Alice는 깃허브에서 'project'라는 이름의 **원격 저장소**를 만들었다.
   * **원격 저장소(Remote repository)**: 일반적으로 [GitHub](https://github.com/), [GitLab](https://gitlab.com/) 또는 [BitBucket](https://bitbucket.org/)과 같은 호스팅 서비스에서 호스팅된 저장소.
1. 이 원격 저장소를 `git clone https://github.com/alice/project.git` 명령으로 자신의 컴퓨터에 복사해 **로컬 저장소**를 만들었다.
   * **로컬 저장소(Local repository)**: 컴퓨터의 로컬 환경에 위치한 저장소.
1. 그리고 **작업 디렉토리**에서 `index.html` 파일을 작성했다.
   * **작업 디렉토리(Working directory)**: 실제 파일이 위치한 디렉토리.
1. 이 파일을 `git add index.html` 명령으로 변경된(Modified) 파일들을 **스테이징**해 **인덱스** 영역에 등록했다.
   * **스테이징(Staging)**: 확정할 변경 사항을 준비시키는 것.
   * **인덱스(Index)**: 확정할 준비가 된 변경 사항들이 모인 영역.
1. 이어서 `git commit -m "index.html 추가"` 명령으로 스테이징된(Staged) 변경 사항을 **커밋**해 로컬 저장소에 등록했다.
   * **커밋(Commit)**: 인덱스의 변경 사항들을 확정하는 것. 여기까지는 로컬 저장소에서 일어나는 일이며, 아직 다른 사람에게는 변경 사항이 공개되지 않은 상태다.
   * **헤드(HEAD)**: 작업 중인 브랜치의 선두를 가리키는 포인터. 헤드 이하의 커밋들을 확정된 것으로 취급하며, 필요에 따라 특정 커밋이나 브랜치를 가리키도록 헤드를 움직여 작업 디렉토리의 상태를 바꿀 수 있다.
1. 마지막으로 `git push origin master` 명령으로 **푸시**해 커밋된(Committed) 변경 사항을 원격 저장소에 게시했다.
   * **푸시(Push)**: 확정된 변경 사항을 원격 저장소에 게시하는 것. 드디어 변경 사항이 공개된다.
   * **`origin`**: 로컬 저장소의 원본 원격 저장소. `clone` 과정에서 자동으로 등록된다. `clone`으로 로컬 저장소를 만든 것이 아니라면 따로 추가해야 한다.

포크(Fork)나 풀 리퀘스트(Pull request) 등 깃허브에 관한 내용은 [오픈소스 입문을 위한 아주 구체적인 가이드](https://parksb.github.io/article/13.html)에서 소개했다.

## 파일 스테이징 취소하기

* Alice는 `git add main.js` 명령으로 파일을 스테이징했다.
* `main.js`를 언스테이징(Unstaging)하고자 한다.

`reset` 명령을 사용하면 파일을 언스테이징 할 수 있다.

```
$ git reset main.js
```

파일명을 명시하지 않으면 스테이지된 모든 파일을 언스테이징한다.

## 마지막 커밋 취소하기

* Alice는 방금 `lib.js` 파일을 빠뜨리고 커밋했다.
* 커밋을 취소하고 파일을 추가해 새로 커밋하고자 한다.

헤드를 옮겨 마지막 커밋을 취소한다. `--soft` 옵션은 작업 디렉토리와 인덱스를 보존해 파일이 스테이지된 상태를 유지하도록 한다. `HEAD^`는 헤드의 직전 위치를 의미한다. 즉, 현재 브랜치의 마지막 커밋을 뜻한다.

```bash
$ git reset --soft HEAD^
```

빠뜨린 파일을 추가하고 다시 커밋한다.

```bash
$ git add lib.js
$ git commit -m "자바스크립트 파일 추가"
```

## 마지막 커밋 메시지 수정하기

* Alice는 방금 커밋한 커밋 메시지 "테스트ㅌ 코드 추가"에 오타가 있는 것을 발견했다.
* 직전 커밋의 메시지를 "테스트 코드 추가"로 수정하고자 한다.

`--amend` 옵션으로 커밋해 직전 커밋 메시지를 수정한다.

```bash
$ git commit --amend -m "테스트 코드 추가"
```

## 이미 푸시한 커밋 메시지 수정하기

* Alice는 과거 커밋 메시지 "테스트ㅌ 코드 추가"에 오타가 있는 것을 발견했다.
* 해당 커밋 메시지를 "테스트 코드 추가"로 수정하고자 한다.

먼저 해당 커밋으로 리베이스해야 한다. `--interactive` 또는 `-i` 옵션을 주면 텍스트 에디터가 열리며 커밋 내역이 나타난다.

```bash
$ git rebase -i
```
```bash
pick 381cd2a 코드 품질 개선
pick f772ba1 테스트ㅌ 코드 추가
pick 2ad65fe 하단 버튼 추가
```

여기서 수정하고자 하는 커밋 해시(`f772ba1`) 앞의 `pick`을 `edit` 또는 `e`로 바꾸고 저장한다.

```bash
pick 381cd2a 코드 품질 개선
edit f772ba1 테스트ㅌ 코드 추가
pick 2ad65fe 하단 버튼 추가
```

이제 커밋 메시지를 새로 작성해 커밋하고, 리베이스를 진행한다. 마음이 바뀌었다면 리베이스 명령의 `--abort` 옵션으로 리베이스를 중단할 수 있다. 리베이스 이후엔 `--force` 또는 `-f` 옵션으로 푸시한다. 이렇게 하면 과거 커밋 이력이 변경되기 때문에 협업을 하는 상황이라면 반드시 사전에 협의를 해야한다.

```bash
$ git commit --amend -m "테스트 코드 추가"
$ git rebase --continue
$ git push -f origin master
```

좀 더 직관적이고 쉽게 커밋 정보를 변경하고 싶다면 [git-amend](https://github.com/Elevista/git-amend)와 같은 유틸을 쓸 수도 있다.

## 커밋을 과거로 되돌리기

* Alice는 버튼의 색깔을 바꾸는 작업들을 커밋했으나 모든 게 잘못됐다는 것을 깨달았다.
* 모든 버튼의 색깔을 똑같이 만들기 위해 과거 버전으로 돌아가 코드를 다시 작성하고자 한다.

우선 돌아가고 싶은 버전의 커밋 해시(`21929f8`)를 확인한다.

```bash
$ git reflog
28ca4ca HEAD@{0}: commit: 오른쪽 버튼 색깔을 파란색으로 변경
8eefd4a HEAD@{1}: commit: 가운데 버튼 색깔을 초록색으로 변경
21929f8 HEAD@{2}: commit: 왼쪽 버튼 색깔을 빨간색으로 변경
```

그리고 `reset`을 이용해 헤드를 특정 커밋으로 옮긴다. `reset`의 기본 옵션은 `--mixed`이며, 작업 디렉토리는 그대로 유지한 채 헤드와 인덱스를 변경한다. `--hard` 옵션의 경우 작업 디렉토리와 헤드, 인덱스를 모두 변경한다. 마지막으로 `--soft` 옵션은 헤드만 변경한다.

```bash
$ git reset --hard 21929f8
```

코드를 수정한 뒤, 파일을 스테이징하고 다시 커밋한다.

```bash
$ git add *
$ git commit -m "모든 버튼 색깔을 노란색으로 변경"
```

이 방법을 사용하면 되돌린 커밋 히스토리가 모두 사라진다. 커밋이후 `--force`으로 푸시하면 이미 푸시한 커밋까지 되돌릴 수도 있지만, 권장하는 방법은 아니다.

## 푸시한 커밋을 과거로 되돌리기

* Alice는 버튼의 색깔을 바꾸는 작업들을 커밋, 푸시했으나 모든 게 잘못됐다는 것을 깨달았다.
* 모든 버튼의 색깔을 똑같이 만들기 위해 과거 버전으로 돌아가 코드를 다시 작성하고자 한다.

`revert` 명령을 사용하면 된다. `revert`는 `reset`과 달리 커밋 히스토리를 남긴다. 협업을 하는 상황에서 이미 푸시한 커밋을 되돌리고 싶다면 `reset` 보다는 `revert`를 사용하는 것이 좋다. 먼저 돌아리고 싶은 버전의 커밋 해시들(`21929f8`, `8eefd4a`, `28ca4ca`)을 확인한다.

```bash
$ git reflog
28ca4ca HEAD@{0}: commit: 오른쪽 버튼 색깔을 파란색으로 변경
8eefd4a HEAD@{1}: commit: 가운데 버튼 색깔을 초록색으로 변경
21929f8 HEAD@{2}: commit: 왼쪽 버튼 색깔을 빨간색으로 변경
```

그리고 되돌리고 싶은 커밋의 범위를 지정해 `revert`를 실행하고, 에디터에서 커밋 메시지를 작성한다. 만약 특정 하나의 커밋만 되돌리고 싶다면 커밋 해시를 하나만 입력해도 된다.

```bash
$ git revert 21929f8...28ca4ca
Revert "왼쪽 버튼 색깔을 빨간색으로 변경"
Revert "가운데 버튼 색깔을 초록색으로 변경"
Revert "오른쪽 버튼 색깔을 파란색으로 변경"
```

푸시하면 버튼의 색깔을 바꾼 작업들이 취소된다.

```bash
$ git push origin master
```

히스토리에는 세 개의 커밋이 추가된 것을 볼 수 있다.

```bash
$ git reflog
132bf27 HEAD@{0}: commit: Revert "오른쪽 버튼 색깔을 빨간색으로 변경"
b2c409f HEAD@{1}: commit: Revert "가운데 버튼 색깔을 초록색으로 변경"
4ef1104 HEAD@{2}: commit: Revert "왼쪽 버튼 색깔을 파란색으로 변경"
28ca4ca HEAD@{3}: commit: 오른쪽 버튼 색깔을 파란색으로 변경
8eefd4a HEAD@{4}: commit: 가운데 버튼 색깔을 초록색으로 변경
21929f8 HEAD@{5}: commit: 왼쪽 버튼 색깔을 빨간색으로 변경
```

## 푸시한 파일 삭제하기

* Alice는 공유할 필요가 없는 파일을 원격 저장소에 푸시했다.
* 실수로 푸시한 파일 `setting.txt`를 원격 저장소에서 삭제하고자 한다.

원격 저장소에 올라간 파일 `setting.txt`를 삭제한다. `--cached` 옵션은 인덱스에서만 파일을 삭제한다는 의미로, `--cached` 옵션을 주면 로컬 저장소의 파일은 지우지 않는다.

```bash
$ git rm --cached setting.txt
```

이제 원격 저장소의 master 브랜치에 반영한다.

```bash
$ git commit -m "설정 파일 제거"
$ git push orgin master
```

히스토리가 그대로 남기 때문에 민감한 파일의 경우 이 방법으로 지워선 안 된다. 커밋에서 제외할 파일은 미리 `.gitignore` 파일에 명시하도록 하자.

## 푸시한 파일 흔적없이 삭제하기

* Alice는 절대 공개해서는 안되는 파일을 원격 저장소에 푸시했다.
* 실수로 푸시한 파일 `password.txt`를 원격 저장소에서 삭제하고자 한다.

먼저 모든 히스토리에서 `password.txt`를 제거해야 한다. `filter-branch`를 사용하면 브랜치의 히스토리 전체에서 특정 커밋만 필터링해 수정할 수 있으며, 여기에 `--index-filter` 옵션을 주면 인덱스를 수정하게 된다. 아래 명령의 경우 모든 커밋에서 `git rm --cached --ignore-unmatch password.txt` 명령을 실행한다. 참고로 `rm` 명령의 `--ignore-unmatch` 옵션은 파일이 일치하지 않아도 0을 리턴하도록 해 명령이 반복되게 만든다.

```bash
$ git filter-branch -f --index-filter "git rm --cached --ignore-unmatch password.txt" HEAD
```

파일을 삭제하는 과정에서 아무런 내용이 없는 빈 커밋이 생길 수 있다. 이제 모든 히스토리에서 빈 커밋을 제거하고 푸시한다.

```bash
$ git filter-branch -f --prune-empty HEAD
$ git push -f origin master
```

## 원격 저장소에서 업데이트 받아오기

* Alice는 오랜만에 로컬 저장소의 master 브랜치를 업데이트하려 한다.
* 며칠전 Bob이 원본 원격 저장소 alice/project에 3개의 커밋을 추가했다.
* 원본 저장소 alice/project에 추가된 3개의 커밋을 로컬 저장소로 가져와 업데이트하고자 한다.

`fetch`와 `pull` 두 가지 방법이 있다. `fetch`를 실행하면 원격 저장소의 내용을 로컬 저장소로 가져오며, 임시로 `FETCH_HEAD`라는 이름의 브랜치를 만든다. (`git checkout FETCH_HEAD` 명령으로 원격 저장소에서 가져온 업데이트를 확인할 수 있다.)

```bash
$ git fetch origin
```

그리고 `merge`로 가져온 내용을 master 브랜치에 병합(Merge)한다. 만약 병합과정에서 충돌(Conflicts)이 발생하면 직접 파일을 수정해줘야 한다.

```bash
$ git checkout master
$ git merge origin/master
```

`pull`의 경우 `fetch`와 `merge`를 연달아 진행한다. 현재 체크아웃하고 있는 브랜치의 원격 저장소에서 내용을 가져오는 경우 매개변수(아래 예시에서는 `origin master`)를 생략해도 된다.

```bash
$ git pull origin master
```

## 병합 커밋없이 풀하기

* Bob은 alice/project 저장소의 master 브랜치에 main.js를 수정하고 커밋, 푸시했다.
* Alice는 master 브랜치에서 index.html 파일을 수정하고 커밋했다.
* Alice는 `pull` 명령으로 원격 저장소 alice/project에서 변경 사항을 가져오려 한다.
* 이때 병합 커밋(Merge commit)을 만들지 않고 원격 저장소 내용을 가져오고자 한다.

원격 저장소와 로컬 저장소 모두 새로운 커밋을 가지고 있기 때문에 논 패스트 포워드(Non fast-forward)가 발생한다. 반대 경우인 패스트 포워드(Fast-forward)는 병합하려는 브랜치에 새로운 커밋이 없는 상황에서 발생하며, 이때는 HEAD를 최신 커밋으로 옮기는 것만으로 병합을 마칠 수 있다. 하지만 논 패스트 포워드는 별도의 병합 커밋이 필요하기 때문에 "Merge branch 'master' of `https://github.com/alice/project`"와 같은 메시지를 가진 커밋을 만든다.

혼자 작업하는 프로젝트라면 큰 상관이 없겠지만, 여러 사람이 프로젝트에 참여해 병합 커밋을 만들기 시작하면 히스토리가 지저분해진다.

```
───O2───O2───┐ (origin/master)
   └────M1───M2 (master)
             Merge branch 'master' of https://github.com/alice/project
```

이러한 병합 커밋을 만들지 않으려면 `--rebase` 옵션으로 리베이스 병합을 시키면 된다. (이때 스테이징되지 않은 변경 사항이 있으면 안 된다.)

```bash
$ git pull --rebase
```

로컬 저장소의 브랜치가 원격 저장소의 브랜치의 최신 커밋으로 리베이스되어 병합 커밋이 남지 않는다.

```
───O2───O2 (origin/master)
        └────M1 (master)
```

## 포크한 로컬 저장소를 최신으로 유지하기

* Alice는 bob/project 저장소를 포크해서 alice/project 저장소를 만들었다.
* 그 사이 bob/project 저장소에는 3개의 커밋이 추가되었다.
* 원본 저장소인 bob/project에서 3개의 커밋을 가져와 alice/project를 업데이트하고자 한다.

먼저 Alice가 포크한 Bob의 원격 저장소(bob/project)를 업스트림(Upstream)이라는 이름으로 추가한다.

```bash
$ git remote add upstream https://github.com/bob/project.git
```

`git remote` 명령에 `--verbose` 또는 `-v` 옵션을 주면 원격 저장소 목록이 나오는데, 업스트림이 잘 추가됐다면 이 목록에서 확인할 수 있다.

```bash
$ git remote -v
origin https://github.com/alice/project.git
upstream https://github.com/bob/project.git
```

최신 내용을 가진 업스트림(bob/project)의 master 브랜치를 가져와 로컬 저장소(alice/project)의 master 브랜치에 병합한다. 이후에 bob/project에 새 커밋이 추가될 때도 같은 명령을 실행하면 된다.

```bash
$ git fetch upstream
$ git checkout master
$ git merge upstream/master
```

## 작업 내용을 백업하고 다른 브랜치 체크아웃하기

* Alice와 Bob은 각각 featA, featB 브랜치에서 index.js를 수정했다.
* Alice는 featA 브랜치에서 작업하던 중 Bob이 작업하고 있는 featB 브랜치를 확인할 일이 생겼다.
* featA의 작업 내용을 백업하고 featB 브랜치를 체크아웃하고자 한다.

featA 브랜치에 커밋되지 않은 변경 사항을 남겨두고 `git checkout featB`를 실행해 featB 브랜치로 넘어가려하면 파일이 덮어쓰기 될 수 있다는 에러가 나온다.

```bash
$ git checkout featB
error: Your local changes to the following files would be overwritten by checkout:
  index.js
Please commit your changes or stash them before you switch branches.
Aborting
```

체크아웃 뿐만 아니라 리베이스(Rebase)나 풀(Pull) 등 브랜치의 작업 디렉토리가 변경되는 상황에서 만날 수 있는 에러다. 작업 내용을 커밋하고 featB에 갔다가 다시 돌아와 마지막 커밋을 취소할 수도 있겠지만, 가장 깔끔한 방법은 `stash`를 이용하는 것이다. 이렇게 하면 스테이지되지 않은 파일들을 임시로 백업해 작업 디렉토리를 깨끗하게 만들 수 있다.

아래와 같이 한 줄의 명령으로 간단하게 작업 내용을 백업할 수 있다.

```bash
$ git stash
Saved working directory and index state WIP on featA: e32584d Add featA index.js
```

작업 디렉토리가 헤드로 돌아갔으므로 안전하게 featB 브랜치를 체크아웃할 수 있게 됐다. 만약 백업한 내용을 되돌리고 싶다면 `pop`하면 된다.

```bash
$ git stash pop
```

`save <name>`으로 이름을 붙여 백업하고, `list`로 목록을 확인할 수 있다. `pop stash@<id>`로 특정 백업을 복원할 수도 있다.

```bash
$ git stash save ADD_INDEX_JS
Saved working directory and index state On featA: ADD_INDEX_JS
```
```bash
$ git stash list
stash@{0}: On featA: ADD_INDEX_JS
```
```bash
$ git stash pop stash@{0}
```

## 풀 리퀘스트에서 Squash and Merge된 커밋 제외하기

```
───M1───M2───S1───M3 (master)
   └────A1───A2 (featA)
             └────B1───B2 (featB)
```

* Alice는 master 브랜치에서 featA 브랜치를 만들어 A1, A2 커밋을 추가하고 master에 squash and merge했다.
* 그리고 featA 브랜치에서 featB 브랜치를 만들어 B1, B2 커밋을 추가했다.
* 그 사이 Bob이 master 브랜치에 M3 커밋을 추가했다.
* Alice는 featB 브랜치를 master 브랜치에 병합하기 위해 PR을 보냈다.
* A1, A2는 master에 S1 커밋으로 squash and merge 됐기 때문에 PR에는 A1, A2, B1, B2 커밋이 모두 포함된다.
* PR에서 A1, A2 커밋을 빼고 B1, B2 커밋만 포함시키고자 한다.

만약 Alice가 master 브랜치의 M3에서 featB 브랜치를 만들었다면 이런 일이 생기지 않았을 것이다. 설령 A1, A2, B1, B2 커밋이 그대로 병합돼도 내용에는 문제가 없을 것이다. 하지만 PR 커밋 내역에 이미 병합된 커밋들이 쌓여 있는 것은 보기 좋지 않다. 입사 후 이런 실수를 했는데, 너무 당황스러웠다.

B1, B2 커밋을 복사해 M3의 자식으로 만들기 위해 `--onto` 옵션으로 리베이스하고, `--force` 또는 `-f` 옵션으로 푸시한다. 보다시피 커밋을 제외하거나 뺀다는 개념이 아니다.

```bash
$ git checkout featB
$ git rebase --onto featA master
$ git push -f origin featB
```

이제 B1, B2 커밋이 복사되어 같은 내용의 B1', B2' 커밋이 M3를 부모로 갖게 된다. (기존 B1, B2 커밋은 버려지지만 사라지지는 않는다.) 최종적으로 PR에서 A1과 A2 커밋도 깔끔히 사라진다.

```
───M1───M2───S1─────────M3 (master)
   └────A1───A2 (featA) └───B1'───B2' (featB)
             └───B1───B2 [abandoned]
```

## 병합 충돌 해결하고 풀 리퀘스트 보내기

* Alice는 bob/project 저장소의 코드를 수정하고 bob/project의 master 브랜치에 풀 리퀘스트를 보냈다.
* 그 사이 Carol이 Alice와 같은 코드를 수정했고, Carol의 풀 리퀘스트가 먼저 master에 병합되었다.
* Alice의 풀 리퀘스트에 병합 충돌(Merge conflicts) 위험이 생겨 이를 해결하고자 한다.

Alice와 Carol이 같은 부분을 수정했기 때문에 병합 충돌이 발생했다. 이때는 master에 Alice의 변경 사항을 반영할지, Carol의 작업을 유지할지 수동으로 결정해줘야 한다.

이를 해결하는 데는 두 가지 방법이 있는데, 첫 번째는 bob/project의 master를 가져와 Alice의 브랜치 alice-branch에 병합하는 것이다.

```bash
$ git pull origin master
```

이렇게하면 bob/project의 master 브랜치의 내용을 로컬로 가져와 Alice의 브랜치에 병합된다. 이때 병합 충돌이 발생하는데, 에디터에서는 아래와 같이 보인다.

```javascript
function add(a, b) {
<<<<<< HEAD
  return a + b;
======
  return b + a;
>>>>>> master
}
```

HEAD는 Alice의 변경 사항(Current chnage)이고, master는 Carol의 변경 사항(Incoming change)이다. 두 변경 사항 중 하나를 선택하면 된다. Alice는 `======` 부터 `>>>>>> master` 까지의 내용을 지움으로써 자신이 작성한 변경 사항을 선택했다.

```javascript
function add(a, b) {
  return a + b;
}
```

파일을 저장한 뒤 병합을 계속 진행한다. 마지막으로 해당 내용을 푸시한다.

```bash
$ git merge --continue
$ git push origin alice-branch
```

이렇게 하면 `Merge branch 'master' of https://github.com/bob/project`와 같은 메시지를 가진 병합 커밋이 생긴다. 히스토리를 더 깔끔하게 만들고 싶다면 두 번째 방법을 사용하면 된다. 두 번째 방법은 Alice의 브랜치를 origin/master 브랜치의 최신 커밋에 리베이스하는 것이다.

```bash
$ git checkout alice-branch
$ git pull --rebase origin master
```

bob/project의 master 브랜치를 가져와 최신 커밋에 Alice의 브랜치 alice-branch를 리베이스한다. 이제 Alice의 커밋은 master의 최신 커밋을 향해 한 발자국씩 나아간다.

```
   ┌────C1───┐ (carol-branch)
───M1───M2───M3───M4 (master)
   └────A1 (alice-branch)
```

원래 Alice의 브랜치가 M1 커밋을 베이스로 했기 때문에 다음 커밋인 M2로 리베이스된다.

```
   ┌────C1───┐ (carol-branch)
───M1───M2───M3───M4 (master)
        └────A1 (alice-branch)
```

이어서 M3 커밋에 리베이스된다.

```
   ┌────C1───┐ (carol-branch)
───M1───M2───M3───M4 (master)
             └────F1 (alice-branch)
```

M3 커밋에 리베이스하자 병합 충돌이 발생해 리베이스가 중단됐다. 첫 번째 방법과 마찬가지로 두 변경 사항 중 하나를 선택하고 저장해 병합 충돌을 해결한다. 이어서 `--continue` 옵션으로 리베이스를 계속 진행한다.

```
$ git rebase --continue
```

마지막으로 Alice의 브랜치가 M4 커밋에 리베이스된다.

```
   ┌────C1───┐ (carol-branch)
───M1───M2───M3───M4 (master)
                  └────F1 (alice-branch)
```

M3 커밋에서 충돌이 있었으므로 그 다음 커밋인 M4에서도 같은 충돌이 발생한다. 앞선 방식과 똑같이 충돌을 해결하고, 리베이스를 마친 뒤 `--force` 또는 `-f` 옵션으로 푸시한다.

리베이스 방식을 사용할 때는 병합 충돌이 있는 모든 커밋들에 대해 충돌을 일일이 해결해줘야 한다. 즉, 충돌난 커밋이 너무 많을 때는 리베이스보다는 단순 병합하는 첫 번재 방법이 더 낫다. 할만할 것 같아서 시작했으나 도중에 무리라고 판단되면 `git rebase --abort`로 리베이스를 중단할 수 있다.

```
$ git rebase --continue
$ git push -f origin alice-branch
```

`--force` 옵션으로 푸시하지 않으면 먼저 원격 저장소의 alice-branch를 풀해야 하는데, 그러면 로컬 저장소에서 리베이스한 커밋과 원격 저장소의 커밋이 중복되어 동일한 내용의 커밋이 생겨버린다.

## 다른 브랜치에서 특정 커밋 복사해오기

* Alice는 featA 브랜치에서 `index.js`를 리팩토링해 커밋했다.
* 이 커밋을 featB 브랜치로 복사하고자 한다.

먼저 featA 브랜치에서 복사할 커밋의 해시(`4a391fc`)를 확인한다.

```bash
$ git checkout featA
$ git reflog
183d9ba HEAD@{0}: commit: 버튼 동작 구현
4a391fc HEAD@{1}: commit: index.js 리팩토링
b51bf86 HEAD@{2}: commit: index.js 추가
```

그리고 `cherry-pick` 명령으로 featB 브랜치에서 해당 커밋을 복사해온다.

```bash
$ git checkout featB
$ git cherry-pick 4a391fc
```

## 브랜치 이름 수정하기

* Alice는 feattA 브랜치에 오타가 있는 것을 발견했다.
* feattA 브랜치의 이름을 featA로 수정하고자 한다.

`branch` 명령에 `--move` 또는 `-m` 옵션을 사용하면 간단하게 변경할 수 있다.

```bash
$ git branch -m feattA featA
```

## Git 명령어 축약하기

* Alice는 [김지현님](https://hyeon.me/) 덕분에 `git log --reflog --graph --oneline --decorate` 명령을 쓰면 로그를 더 편하게 볼 수 있다는 사실을 알게됐다.
* 하지만 명령이 너무 길어 축약해 사용하고자 한다.

`.gitconfig` 파일에서 alias를 설정해주면 된다. `[alias]` 섹션에 축약형과 축약할 명령을 작성하고 저장한다.

```bash
$ vim ~/.gitconfig
```
```bash
[alias]
  lg = log --reflog --graph --oneline --decorate
```

이제 `git l` 명령은 `git log --reflog --graph --oneline --decorate`와 같다. `commit`이나 `checkout` 등의 명령도 같은 방식으로 축약할 수 있다.

```bash
$ git lg
* 1d1eb90 (origin/master, origin/HEAD) 버튼 추가
|\
| * b0a574a (HEAD -> featB, origin/featB) 버튼 색상 변경
| * b2ff985 버튼 동작 구현
|/
* 02e5c44 (featA) 내비게이션바 추가
|\
```

기계인간님의 [편리한 git alias 설정하기](https://johngrib.github.io/wiki/git-alias/)를 참고하면 극한의 편리를 추구할 수도 있다.

## 참고자료

* 생활코딩 "[지옥에서 온 Git](https://opentutorials.org/course/2708)"
* 진유림님 "[초심자를 위한 Github 협업 튜토리얼](https://milooy.wordpress.com/2017/06/21/working-together-with-github-tutorial/)"
* Hemanth HM "[git-tips](https://github.com/git-tips/tips)"
* Scott Chacon, Ben Straub "[Pro Git Book](https://git-scm.com/book/ko/v2)"
* Stackoverflow "[Questions tagged 'git'](https://stackoverflow.com/questions/tagged/git?sort=votes)"
