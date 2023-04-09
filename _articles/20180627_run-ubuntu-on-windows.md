---
id: 19
title: "🐧 윈도우에서 우분투 돌리기"
subtitle: "개발을 위한 WSL 세팅"
date: "2018.06.27"
---

윈도우로 개발을 하는 입장에서 터미널을 다루기란 조금 까다롭다. 리눅스나 OSX 환경에 맞춰진 프로젝트에 참여하면 명령이 다르게 동작해 삽질하고, OSX의 패키지 매니저인 [Homebrew](https://brew.sh/)같은 것도 없어서 또 삽질을 하곤 한다.

때문에 윈도우에서 우분투를 가상머신으로 돌리거나 멀티부팅을 하는 등 다양한 방법들을 시도했는데, 역시 번거롭고 불편했다. 그러던 중 WSL을 알게됐다.

WSL은 Windows Subsystem for Linux의 약자로, 윈도우 서브시스템에 리눅스를 탑재하는 것이다. 마이크로소프트에서 공식적으로 지원하는 것이기 때문에 어느정도 안정성을 보장할 수 있다. 그냥 윈도우 스토어에서 우분투를 설치하면 되기 때문에 방법도 간단하다. [Windows Subsystem for Linux Installation Guide for Windows 10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)을 참고.

설치한 우분투를 실행하여 UNIX 아이디와 패스워드를 설정하고 나면 아래와 같은 화면이 나타난다. 이제 윈도우에서 우분투 bash를 사용할 수 있다!

## 작업 디렉토리 링크하기

`~` 경로는 home 디렉토리를 의미하며, 처음 계정을 생성하면 기본적으로 `/home/{ID}`가 home 디렉토리로 설정된다. 어디서든 `cd` 명령어를 통해 이곳으로 이동할 수 있다. 하지만 주로 작업하는 디렉토리는 이곳이 아니므로, 설정이 필요하다.

home 디렉토리 자체는 나중에 또 다르게 사용할 것 같아서 home 디렉토리의 경로를 변경하기 보다는 이곳에 링크 파일을 두기로 결정했다. 내가 주로 작업 파일을 두는 경로는 `c/Bitnami/wampstack/apache2/htdocs`이다. wsl에서는 c드라이브가 `\mnt` 디렉토리의 하위 폴더로 존재하므로, 우분투에서 절대 경로는 `/mnt/c/Bitnami/wampstack/apache2/htdocs`가 된다. 만약 home 디렉토리 경로를 변경한다면 다음 명령을 사용하면 된다.

```bash
# usermod -d {PATH} {ID}
$ usermod -d /mnt/c/Bitnami/wampstack/apache2/htdocs parksb
```

링크 파일은 윈도우의 바로가기 같은 것이다. 링크는 symbolic link와 hard link로 나뉘는데, 전자는 윈도우의 바로가기와 완전히 동일하다. 만약 원본 파일이 삭제된다면 symbolic link도 무효화된다. 후자는 동일한 내용의 다른 파일을 만드는 것이다. 원본 파일이나 hard link 둘 중 하나가 삭제돼도 다른 하나는 남아있다. 만약 원본 파일의 내용이 변경된다면 hard link의 파일 내용도 변경된다.

내가 원하는 것은 바로가기이므로, symbolic link 파일을 만들어보겠다.

```bash
# ln -s {OPTION} {ORIGIN} {TARGET}
$ ln -s /mnt/c/Bitnami/wampstack/apache2/htdocs /home/parksb/htdocs
```

이렇게 하면 `/home/parksb`에 `/mnt/c/Bitnami/wampstack/apache2/htdocs` 디렉토리를 링크한 `htdocs` 파일이 만들어진다. 따라서 `cd ~/htdocs`를 하면 `/mnt/c/Bitnami/wampstack/apache2/htdocs`로 이동하는 것과 같아진다. `-s` 옵션은 symbolic link 파일을 만들겠다는 의미다. 만약 hard link 파일을 만든다면 아무런 옵션을 주지 않아도 된다.

## Git branch 보여주기

git bash를 사용하면 bash에 git branch가 나타난다. 하지만 wsl bash에서는 git branch가 나타나지 않으므로 따로 설정을 해줘야 한다. 먼저 vim으로 `.bashrc` 파일을 열어서 bash 설정을 변경해주자. 나는 vim으로 수정했는데, vim이 익숙하지 않다면 [vim 사용법](http://www.morenice.kr/25)을 참고해보자. [절대로 리눅스 파일을 윈도우 툴로 수정해서는 안 된다!](https://blogs.msdn.microsoft.com/commandline/2016/11/17/do-not-change-linux-files-using-windows-apps-and-tools/) 위험한 결과를 초래할 수 있으니 cli 에디터를 사용하지 못하겠다면 차라리 우분투를 gui로 사용하는 것을 권한다.

```bash
$ vim ~/.bashrc
```

맨 아래에 다음과 같은 구문을 추가해준다. ([Display git branch in bash prompt](https://gist.github.com/justintv/168835)를 참고해 기존 형식에 맞게 조금 수정했다.)

```shell
# display git branch in bash prompt
git_branch() {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \\(.*\\)/(\\1)/'
}

export PS1='\\[\\033[0;32m\\]\\[\\033[0m\\033[0;32m\\]\\u@\\h:\\[\\033[0;36m\\]\\w\\[\\033[0;32m\\]$(git_branch)\\[\\033[0;32m\\]\\[\\033[0m\\033[0;32m\\] \\$\\[\\033[0m\\033[0;32m\\]\\[\\033[0m\\]'
```

저장하고, 수정한 것을 적용시켜준다.

```bash
$ source ~/.bashrc
```

git init이 안 된 곳에는 branch가 나오지 않고, init이 된 곳에는 나타난다.

## npm 사용하기

가장 먼저 터진 이슈는 vscode의 통합 터미널에서 `npm`이 안 먹히는 것이었다.

```bash
$ npm -v
: not foundram Files/nodejs/npm: 3: /mnt/c/Program Files/nodejs/npm:
: not foundram Files/nodejs/npm: 5: /mnt/c/Program Files/nodejs/npm:
/mnt/c/Program Files/nodejs/npm: 6: /mnt/c/Program Files/nodejs/npm: Syntax error: word unexpected (expecting "in")
```

검색해보니 [Issue running npm command](https://github.com/Microsoft/WSL/issues/1512)라는 깃허브의 WSL 저장소 이슈가 가장 먼저 나왔다. WSL은 서브시스템이기 때문에 윈도우에 node를 설치했더라도 리눅스쪽에 node를 다시 설치해줘야 한다.

```bash
$ curl -sL <https://deb.nodesource.com/setup_8.x> | sudo -E bash -
$ sudo apt-get install -y nodejs
```

그리고 .profile 파일에서 환경변수를 설정해야 한다.

```bash
$ vim ~/.profile
```

.profile 파일의 PATH 부분을 다음과 같이 수정한다.

```shell
PATH="$HOME/bin:$HOME/.local/bin:/usr/bin:$PATH"
```

저장하고 나와서 설정을 바로 적용해준다.

```bash
$ source ~/.profile
```

npm의 위치를 확인해보면 우분투 경로가 나온다.

```bash
$ which npm
/usr/bin/npm
```

이제 윈도우에서도 리눅스와 같은 환경에서 작업할 수 있다!
