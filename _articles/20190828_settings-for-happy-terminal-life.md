---
id: 33
title: "해피 터미널 라이프"
subtitle: "Dotfiles 세팅해 광명찾기"
date: "2019.08.28"
---

> 2023년 7월 25일에 내용을 업데이트했습니다. 2019년 8월판은 [여기](https://github.com/parksb/parksb.github.io/blob/59d448db805b5061debb5a61dfd5f3fd2f49070e/_articles/20190828_settings-for-happy-terminal-life.md)에서 확인할 수 있습니다.

## Terminal Emulator

[Alacritty](https://alacritty.org/)는 OpenGL을 이용해 렌더링에 GPU 가속을 지원받을 수 있는 터미널 에뮬레이터다. 러스트로 작성되었으며, 높은 성능을 내세우고 있다. Alacritty의 모든 설정은 `~/.alacritty.toml` 파일로 관리할 수 있고, 저장하면 변경 사항이 즉시 반영된다.

다만 0.12.0 버전부터 [한글 입력 버그](https://github.com/alacritty/alacritty)가 발생하고 있다. 대신 사용할 수 있는 GPU 가속 터미널 에뮬레이터로는 [kitty](https://sw.kovidgoyal.net/kitty/)와 [wezterm](https://wezfurlong.org/wezterm/)이 있다.

터미널에서 각종 아이콘을 사용하기 위해서는 [Nerd Fonts](https://github.com/ryanoasis/nerd-fonts)를 사용해야 한다. [Nerd Font 글리프가 반영된 폰트 목록](https://github.com/ryanoasis/nerd-fonts#patched-fonts)이 있는데, 이중에서 마음에 드는 폰트를 받아서 사용하면 된다.

## Git

[git](https://git-scm.com/)은 분산 버전 관리 시스템이다. 프로젝트에 git을 사용하지 않더라도 다른 프로그램을 설치할 때 필요하다.

alias를 설정하면 긴 명령을 축약할 수 있다. 가령 `git status` 대신 `git s`를 사용하게 만드는 것이 가능하다. git에 관련된 설정은 `.gitconfig` 파일로 관리할 수 있다.

```
[alias]
  l = log --reflog --graph --oneline --decorate
```

이제 `git l`은 `git log --reflog --graph --oneline --decorate`와 동일하다. 기계인간님의 [편리한 git alias 설정하기](https://johngrib.github.io/wiki/git-alias/)를 참고하면 극한의 편리를 추구할 수도 있다.

## Fish Shell

![](/images/45cc34e8-28ae-49e8-9225-7f7a560390a5.webp)

[fish](https://fishshell.com/)는 사용자 친화적인 셸이다. 히스토리를 기반으로 타이핑 중 명령어를 제안해주며, man 페이지를 바탕으로 인자 자동완성도 제공한다. 또한 bash 셸 스크립트보다 편리한 자체 스크립트를 제공한다. `~/.config/fish/functions` 디렉토리에 fish 함수 파일을 작성해두면 해당 함수를 셸 명령처럼 사용할 수 있다는 점도 재밌다. [zsh](https://www.zsh.org/)처럼 각종 플러그인도 설치할 수 있다. [fisher](https://github.com/jorgebucaran/fisher)는 fish를 위한 플러그인 매니저다.

- [z](https://github.com/jethrokuan/z): 빠르게 특정 디렉토리로 점프할 수 있도록 해준다.
- [puffer-fish](https://github.com/nickeb96/puffer-fish): 연속적인 `..`을 `../..`, `../../..`으로 확장해준다.

## Neovim

![](/images/1c63192f-294f-4f16-9c32-532dae19a23e.webp)

[Neovim](https://neovim.io/)은 [Vim](https://www.vim.org/)을 포크해 현대적으로 리팩토링하는 프로젝트다. 최근 Vim을 사용한다고 하면 대체로 Neovim을 사용한다는 의미로 받아들여질 정도로 광범위하게 인기를 얻고 있다. Neovim을 사용하면 각종 유용한 플러그인을 사용할 수 있고, Vimscript 대신 Lua를 이용해 설정 스크립트를 작성할 수도 있다. 가장 좋은 점은 Vim을 바탕으로 나만의 에디터를 구성할 수 있다는 점인데, 이 덕분에 나는 코드 작성뿐 아니라 문서 작성과 메모, 슬라이드쇼 제작까지도 Neovim으로 한다.

`~/.config/nvim/init.vim` 파일로 Neovim의 설정을 관리할 수 있다. `init.vim` 대신 `init.lua`을 사용하면 Lua로 설정을 작성할 수도 있다. 설정 파일 내용을 수정해 줄번호 표시 여부, 문법 하이라이팅 여부, 들여쓰기 등 일반적인 옵션을 직접 설정할 수 있다.

Neovim에는 다양한 플러그인들이 있고, Vim에서 사용하는 플러그인은 물론, Neovim에서만 사용할 수 있는 플러그인도 있다. 플러그인 매니저를 사용하면 쉽게 플러그인을 설치, 적용하여 사용할 수 있다. 나는 Vim을 사용할 때부터 써온 [vim-plug](https://github.com/junegunn/vim-plug)에 머물러 있는데, 요즘에는 [lazy.nvim](https://github.com/folke/lazy.nvim)을 많이 쓰는 것 같다. 나는 아래와 같은 플러그인을 사용하고 있다.

- [lualine.nvim](https://github.com/nvim-lualine/lualine.nvim): 하단 상태라인과 상단 탭라인을 설정할 수 있다. 원하는 컴포넌트를 배치할 수도 있고, 다양한 테마를 골라서 적용할 수도 있다.
- [nvim-tree.lua](https://github.com/nvim-tree/nvim-tree.lua): 사이드바에 파일 탐색 트리를 보여준다.
- [gitsigns.nvim](https://github.com/lewis6991/gitsigns.nvim): Git 동작을 사용할 수 있게 해준다. 각 라인의 변경 여부를 기호로 보여주며, 변경사항 미리보기, 변경 단위(hunk) 탐색, 단위 스테이징 등의 기능을 제공한다.
- [indent-blankline.nvim](https://github.com/lukas-reineke/indent-blankline.nvim): 들여쓰기마다 수직선을 보여준다.
- [nvim-colorizer.lua](https://github.com/NvChad/nvim-colorizer.lua): 컬러코드의 배경색을 해당 색상으로 보여준다.
- [vim-visual-multi](https://github.com/mg979/vim-visual-multi): 커서를 여러 개 만들어 동시 편집을 할 수 있게 해준다. 특정 문자, 단어에 모두 커서를 만들거나, 여러 줄에 걸쳐 커서를 만들어 사용할 수 있다. 생산성이 차원이 다르게 높아진다.
- [coc.nvim](https://github.com/neoclide/coc.nvim): [LSP(Language Server Protocol)](https://microsoft.github.io/language-server-protocol/)를 통해 코드 자동완성, 심볼트래킹, 코드액션, 문법 진단 등 인텔리센스를 제공한다. Neovim이 자체적으로 LSP를 지원하고 있지만, coc.nvim을 사용하면 더 쉽게 언어를 추가할 수 있다. VSCode도 똑같이 LSP를 사용하는 방식으로 인텔리센스를 제공하기 때문에 말그대로 Neovim이 VSCode를 완전히 대체할 수 있게 해준다. Vim을 쓸 때부터 사용해왔기에 딱히 바꾸지 않고 있는데, 요즘에는 자체 LSP 지원과 [nvim-cmp](https://github.com/hrsh7th/nvim-cmp)도 많이 사용하는 추세다.
- [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter): [tree-sitter](https://github.com/tree-sitter/tree-sitter) 파싱 라이브러리를 이용해 향상된 코드 하이라이팅을 제공한다.
- [nvim-scrollbar](https://github.com/petertriho/nvim-scrollbar): 스크롤바에 다양한 기능을 제공한다. coc.nvim과 연동해 어떤 라인에 문제가 있는지 표시할 수 있고, gitsigns.nvim과 연동해 어떤 라인이 변경되었는지 표시할 수도 있다.
- [hop.nvim](https://github.com/phaazon/hop.nvim): 특정 문자나 단어로 즉시 커서를 옮길 수 있게 해준다.

이것저건 직접 설정하기가 번거롭고 혼란스럽다면, [AstroNvim](https://astronvim.com/)이나 [LazyVim](https://www.lazyvim.org/)을 사용해보는 것도 괜찮다.

## tmux

![](/images/c1245efe-9597-46e4-a36d-662046f3ead7.webp)

[tmux](https://github.com/tmux/tmux)(termial multiplexer)는 터미널의 세션과 창을 분할 관리하기 위한 도구인데, 백그라운드에서 세션을 유지하거나 ssh 접속할 일이 많다면 필수라고 할만하다. 사용 목적은 기본으로 설치되어 있는 screen과 비슷하지만 tmux가 더 편리하다.

tmux는 세션(session), 윈도우(window), 팬(pane)으로 구성된다. 세션은 가장 큰 단위이며, 윈도우는 세션 내에서 탭처럼 사용할 수 있는 화면이다. 팬은 한 윈도우 내에서의 화면 분할을 의미한다.[^edykim] tmux는 기본 prefix 키인 `Ctrl + b`를 누르고 명령 키를 입력하여 조작할 수 있다. 가령 윈도우를 수평 분할하는 키는 `%` 키이기 때문에 `Ctrl + b + %`를 입력하면 윈도우가 수평 분할된다.

tmux 설정은 `~/.tmux.conf` 파일로 관리할 수 있다. 기본 prefix 키는 `Ctrl + b`이지만, 원한다면 설정 파일을 수정해 `Ctrl + a` 등 다른 키로 바꿀 수 있다. (screen의 기본 prefix가 `Ctrl + a`다.)

```
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix
```

tmux에는 다양한 플러그인이 있다. [tpm](https://github.com/tmux-plugins/tpm)을 사용하면 tmux 플러그인을 쉽게 관리할 수 있다.

- [tmux-powerline](https://github.com/erikw/tmux-powerline): 하단에 상태바를 보여준다.
- [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect): 세션과 윈도우, 팬 레이아웃 등 사용 환경을 저장하고 로드할 수 있다.

## 기타 CLI 도구

기본적으로 제공되는 `ls`, `rm`, `cat` 등 coreutils도 훌륭하지만, 기존 도구의 인터페이스나 기능을 개선, 대체하는 각종 대체 도구를 사용할 수도 있다.

- [exa](https://github.com/ogham/exa), [lsd](https://github.com/lsd-rs/lsd): 파일 및 디렉토리 아이콘, 파일 트리 등을 제공하는 `ls` 대체. `--tree` 옵션으로 `tree` 명령도 대체할 수 있다.
- [bat](https://github.com/sharkdp/bat): 문법 하이라이팅, 특수문자 표시, git 변경사항 등 다양한 기능을 지원하는 `cat` 대체.
- [fd](https://github.com/sharkdp/fd): 사용자 친화적인 `find` 대체.
- [ripgrep](https://github.com/BurntSushi/ripgrep): 빠르게 작동하는 `grep` 대체.
- [procs](https://github.com/dalance/procs): 사용자 친화적인 `ps` 대체.
- [trash](https://github.com/sindresorhus/trash-cli). 셸에서 `rm` 명령으로 파일을 지우면 휴지통으로 이동하지 않고 즉시 파일이 제거되는데, `trash` 도구를 통해 휴지통을 사용할 수 있다.
- [delta](https://github.com/dandavison/delta): 문법 하이라이팅, 줄 번호 표시 등 다양한 기능을 제공하는 `diff` 대체. `git diff`에 적용할 수 있다.
- [tldr](https://github.com/tldr-pages/tldr): 셸 명령이 기억나지 않거나, 옵션이 헷갈릴 때 참고할 수 있는 매뉴얼 도구. `man`보다 간결한 설명을 제공하며, 다양한 사용 예시가 포함되어 있다.

나는 기존 명령을 대체하는 도구를 아예 `config.fish` 파일에 alias로 설정해뒀다.

```
alias ls='lsd'
alias tree='lsd --tree'
alias cat='bat'
alias find='fd'
alias grep='rg'
alias ps='procs'
alias rm='trash'
alias diff='delta'
```

## Dotfiles

터미널 환경을 세팅하며 작성한 무수한 설정들, `alacritty.toml`, `.gitconfig`, `fish.conf`, `init.vim` 등의 파일을 통틀어 'dotfiles'라고 부른다. (전통적인 설정 파일들은 모두 `.`으로 시작하는 숨김 파일이기 때문이다.) 이 파일들을 별도 git 저장소에 올려두면 다른 컴퓨터에서 터미널을 설정할 때 그대로 사용할 수 있다.

홈 디렉토리에 있던 기본 설정 파일들을 지우고, 저장소에 올려둔 설정 파일들의 심볼릭 링크를 만들면 모든 컴퓨터에서 터미널 환경을 쉽게 동기화할 수 있다.

```sh
$ rm ~/.gitconfig
$ ln -s ~/dotfiles/.gitconfig ~/.gitconfig
```

[^edykim]: 김용균, "[tmux 입문자 시리즈 요약](https://edykim.com/ko/post/tmux-introductory-series-summary/)", 2014.
