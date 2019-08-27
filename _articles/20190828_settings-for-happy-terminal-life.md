---
id: 33 
title: "해피 터미널 라이프"
subtitle: "dotfiles 세팅해 광명찾기"
date: "2018.08.28"
tags: "UNIX, 터미널"
---

6년간 써온 윈도우 노트북을 포맷하고 다시 WSL 환경을 세팅했다. 포맷을 하도 오랜만에 해서 그런지 설정에 의외로 손이 많이 갔다. 모든 걸 완벽하게 자동화할 겸 세팅을 정리해보기로 했다. 

# Git

우선 [git](https://git-scm.com/)을 설치한다. 자신의 프로젝트에 git을 사용하지 않더라도 (웬만하면 써보자) 다른 프로그램을 설치할 때 필요하다.

```bash
# macOS
$ brew install git
```

```bash
# Linux
$ apt install git
```

그리고 이름과 메일을 설정한다. `--global` 옵션으로 설정하면 모든 프로젝트에서 이 설정을 사용할 수 있다.

```bash
$ git config --global user.name = "jake"
$ git config --global user.email = jake@email.com
```

로그인에 2FA를 사용하고 있다면 `git clone`을 실행해 올바른 로그인 정보를 입력해도 인증에 실패하는 문제가 생긴다. 이 경우 액세스 토큰을 발급받아 비밀번호 대신 사용하면 된다.

## Alias

alias를 설정하면 긴 명령을 축약할 수 있다. 가령 `git status` 대신 `git s`를 사용하게 만드는 것이 가능하다. git에 관련된 설정을 하기 위해서는 .gitconfig 파일을 수정하면 된다.

```bash
$ vim ~/.gitconfig
```

`[alias]` 섹션에 축약할 명령과 축약형을 작성하고 저장한다.

```conf
[alias]
  l = log --reflog --graph --oneline --decorate
```

이제 `git l`은 `git log --reflog --graph --oneline --decorate`와 동일하다. 기계인간님의 [편리한 git alias 설정하기](https://johngrib.github.io/wiki/git-alias/)를 참고하면 극한의 편리를 추구할 수도 있다.

# ZSH & Oh My ZSH 

zsh(Z shell)은 터미널을 더 편리하게 만들어주는 유닉스 셸이다. 기본 셸인 bash 보다 환경 설정이나 플러그인 설치 등이 쉽다. [oh-my-zsh](https://ohmyz.sh/)은 zsh 설정을 관리하기 위한 프레임워크로, 각종 테마와 플러그인을 제공한다.

먼저 zsh을 설치한다.

```bash
# macOS
$ brew install zsh
```

```bash
# Linux
$ apt install zsh
```

zsh을 기본 터미널의 셸로 사용하고 싶으면 환경변수 `$SHELL`을 수정한다. `chsh` 명령에 `-s` 옵션을 주고 대체할 셸의 경로를 인자로 주면 `$SHELL`을 변경할 수 있다.

```bash
$ chsh -s $(which zsh)
```

이어서 oh-my-zsh을 설치한다. curl을 사용해도 되고, wget을 사용해도 된다.

```zsh
# curl
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

```zsh
# wget
$ sh -c "$(wget -O- https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## Theme

테마가 마음에 들지 않다면 .zshrc 파일을 수정해 바꿀 수 있다. .zshrc 파일을 통해 테마 뿐 아니라 플러그인이나 alias 등 zsh의 모든 것을 설정할 수 있다.

```zsh
$ vim ~/.zshrc
```

[oh-my-zsh 저장소에서 기본 테마를 살펴볼 수 있다.](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes) 사용하고자 하는 테마가 기본 테마가 아니라면 테마를 설치하고, oh-my-zsh의 themes 디렉토리에 테마 파일을 넣어줘야 한다. [powerlevel9k](https://github.com/Powerlevel9k/powerlevel9k) 테마는 [powerline](https://github.com/powerline/fonts) 폰트를 사용하는 테마다. 

```zsh
$ git clone https://github.com/bhilburn/powerlevel9k.git $ZSH_CUSTOM/themes/powerlevel9k
```

powerline 폰트도 설치해준다.

```zsh
$ git clone https://github.com/powerline/fonts.git --depth=1
$ ./fonts/install.sh
```

그리고 테마 이름에 맞춰 .zshrc 파일의 `ZSH_THEME` 값을 수정해준다.

```conf
ZSH_THEME="powerlevel9k/powerlevel9k"
```

원한다면 .zshrc 파일을 수정해 powerlevel9k 테마를 직접 설정할 수 있다.

```conf
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status time dir_writable)
POWERLEVEL9K_TIME_FORMAT="%D{%H:%M %y/%m/%d}"
POWERLEVEL9K_STATUS_VERBOSE=true
POWERLEVEL9K_STATUS_CROSS=true
```
 
마지막으로 .zshrc 파일을 저장한 뒤 `source` 명령으로 즉시 설정을 적용할 수 있다.

```zsh
$ source ~/.zshrc
```

## Plugin

플러그인도 쉽게 설치할 수 있다. [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)을 사용하면 명령에 하이라이팅을 줄 수 있는데, 유효한 명령은 녹색, 유효하지 않은 명령은 빨간색으로 보여줘서 편리하다.

```zsh
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting
```

그리고 .zshrc 파일을 열어 `plugins`에 `zsh-syntax-highlighting`을 추가해준다.

```conf
plugins=(
  zsh-syntax-highlighting
)
```

[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/)는 히스토리를 바탕으로 명령어를 추천해주며, [autojump](https://github.com/wting/autojump)는 어디서든 원하는 디렉토리로 이동할 수 있도록 해준다. 각각의 방식으로 설치하고 .zshrc 파일을 수정해주면 된다.

```conf
plugins=(
  zsh-syntax-highlighting
  zsh-autosuggestions
  autojump
)
```

# Vim

터미널에서 [vim](https://github.com/vim/vim)을 자주 사용할 예정이라면 직접 설정을 해두는 것이 좋다. vim은 기본으로 설치되어 있어서 바로 사용할 수 있다. 시스템 vim은 최신 버전이 아닐 수 있으니 `vim --version` 명령으로 버전을 확인해보고 업데이트하는 것을 권장한다.

vim도 zsh와 마찬가지로 .vimrc 파일로 설정할 수 있다.

```zsh
$ vim ~/.vimrc
```

줄번호 표시 여부, 문법 하이라이팅 여부, 들여쓰기 등 일반적인 설정을 할 수 있는데, [기본 설정](https://github.com/vim/vim/blob/master/runtime/defaults.vim)을 그대로 쓰기만해도 무난히 사용할 수 있다. 구체적인 설정 방법은 [simple-vim-guide](https://github.com/johngrib/simple_vim_guide/blob/master/md/vimrc.md)에 잘 나와있다.

## Plugin

vim에는 다양한 플러그인들이 있다. 플러그인 매니저 중 하나인 [vim-plug](https://github.com/junegunn/vim-plug)를 사용하면 쉽게 플러그인을 설치, 적용하여 사용할 수 있다. 원래 [vundle](https://github.com/VundleVim/Vundle.vim)을 사용했는데, [최준건님](https://junegunn.kr/)이 만든 vim-plug가 더 가볍고 빠른 것 같다.

먼저 vim-plug를 설치한다.

```zsh
$ curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

그리고 .vimrc 파일에 vim-plug를 불러오기 위한 구문을 작성한다. 테스트로 사이드바에 디렉토리 트리를 보여주는 [scrooloose/nerdtree](https://github.com/scrooloose/nerdtree)를 설치해봤다.

```conf
call plug#begin('~/.vim/plugged')

Plugin 'scrooloose/nerdtree'

call plug#end()
```

파일을 저장하고 vim 내에서 `:PluginInstall`을 입력하면 플러그인을 설치하기 시작한다. 새로운 플러그인을 설치하고 싶으면 `call plug#begin('...')`과 `call plug#end()` 사이에 `Plugin 'user-name/plugin-name'`을 추가하고 설치 명령을 실행하기만 하면 된다.

하단에 상태바를 보여주는 [vim-airline/vim-airline](https://github.com/vim-airline/vim-airline)과 git 변경 사항을 보여주는 [airblade/vim-gitgutter](https://github.com/airblade/vim-gitgutter), 코드의 문법 오류를 체크해주는 [scrooloose/syntastic](https://github.com/vim-syntastic/syntastic) 등 다양한 플러그인으로 vim을 IDE처럼 만들 수도 있다.[^bluesh]

더 많은 vim 플러그인은 [Vim Awesome](https://vimawesome.com/)에서 찾아볼 수 있다. 

# TMUX

[tmux(Termial Multiplexor)](https://github.com/tmux/tmux)는 터미널의 세션과 창을 분할 관리하기 위한 도구로, 다양한 플러그인을 제공한다. 기본으로 설치되어 있는 screen과 거의 비슷한데, tmux가 더 편리하다는 평이 많은 듯하다. 백그라운드에서 세션을 유지하거나 ssh 접속할 일이 많다면 필요하지만, 그럴 일이 없다면 사용하지 않아도 불편함은 없다.

```zsh
# macOS
$ brew install tmux
```

```zsh
# Linux
$ apt install tmux
```

간단히 `tmux`라고 입력해 실행할 수 있다.

```zsh
$ tmux
```

tmux는 세션(Session), 윈도우(Window), 팬(Pane)으로 구성된다. 세션은 가장 큰 단위이며, 윈도우는 세션 내에서 탭처럼 사용할 수 있는 화면이다. 팬은 한 윈도우 내에서의 화면 분할을 의미한다.[^edykim] tmux는 기본 prefix 키인 `Ctrl + b`를 누르고 명령 키를 입력하여 조작할 수 있다. 가령 윈도우를 수평 분할하는 키는 `%` 키이기 때문에 `Ctrl + b + %`를 입력하면 윈도우가 수평 분할된다.

## Configuration

tmux를 설정하기 위한 .tmux.conf 파일을 홈 디렉토리에 만든다.

```zsh
$ vim ~/.tmux.conf
```

기본 prefix 키는 `Ctrl + b`이지만, 원한다면 .tmux.conf 파일을 수정해 `Ctrl + a` 등 다른 키로 바꿀 수 있다. (screen의 기본 prefix가 `Ctrl + a`다.)

```conf
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix
```

tmux를 사용하면 터미널에서 마우스를 사용할 수 없게 된다. (iTerms에서는 그랬다.) 팬 포커스 이동은 `prefix + q + number` 또는 `prefix + o`를 통해, 스크롤은 `prefix + [ + j or k`를 통해 할 수 있다. 불편하다면 마우스 설정을 켤 수도 있다.

```conf
set-option -g mouse on
```

파일을 저장하고 `tmux source ~/.tmux.conf`를 실행해 적용한다.

## Plugin

tmux 플러그인을 쉽게 관리하기 위해 [tpm](https://github.com/tmux-plugins/tpm)을 먼저 설치한다.

```zsh
$ git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

.tmux.conf 파일에 tpm을 설치, 실행하기 위한 코드를 추가한다.

```conf
set -g @plugin 'tmux-plugins/tpm'
run -b '~/.tmux/plugins/tpm/tpm'
```

`run -b '~/.tmux/plugins/tpm/tpm'`은 tpm을 초기화하기 위한 라인이므로 항상 설정 파일의 맨 아래에 위치해야 한다. tpm으로 관리되는 다른 플러그인도 설치하고 싶으면 같은 방식으로 `set -g @plugin 'user-name/plugin-name'`을 추가한다. 이제 파일을 저장하고 `prefix + I`를 입력하면 플러그인이 설치된다. 

하단에 상태바를 보여주는 [tmux-powerline](https://github.com/erikw/tmux-powerline), 세션과 윈도우, 팬 레이아웃 등 환경을 저장할 수 있도록 해주는 [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) 등의 플러그인이 있다.

# Dotfiles

이렇게 많은 설정 파일들을 관리하기 위해 dotfiles 저장소를 만들었다. 여기에 .zshrc나 .vimrc 등의 파일들을 올려두고 클론받아서 사용한다.

```zsh
$ git clone https://github.com/ParkSB/dotfiles.git
```

그리고 홈 디렉토리에 있던 기본 설정 파일들을 지우고 저장소에 올려둔 설정 파일들의 심볼릭 링크를 만들어줬다.

```zsh
$ rm ~/.vimrc
$ ln -s ./dotfiles/.vimrc ~/.vimrc
```

회사에서 쓰는 맥북과 집에서 쓰는 윈도우 노트북의 WSL, 따로 운영 중인 우분투 서버의 설정을 동기화하는 게 문제였는데 잘 해결됐다. 나중을 위해서 프로그램과 플러그인을 설치하는 쉘 스크립트도 작성해뒀다.

[^bluesh]: 오승환, "[Vim을 IDE처럼 사용하기](http://blog.b1ue.sh/2016/10/09/vim-ide/)", 2016.
[^edykim]: 김용균, "[tmux 입문자 시리즈 요약](https://edykim.com/ko/post/tmux-introductory-series-summary/)", 2014.