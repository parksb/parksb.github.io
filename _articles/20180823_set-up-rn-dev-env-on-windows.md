---
id: 20
title: "윈도우즈에서 React Native 개발 환경 세팅하기"
subtitle: "개발 환경 세팅만 사흘"
date: "2018.08.23"
---

이번에 참여하게 된 프로젝트에서 리액트 네이티브를 이용하게 됐다. 리액트 네이티브는 리액트 아키텍처를 모바일에 적용한 것으로, ES6 문법과 리액트를 이용해 모바일 어플리케이션을 개발할 수 있도록 해주는 프레임워크다. 기존의 웹 프로그래밍 문법을 (거의)그대로 사용할 수 있다는 점과 안드로이드/iOS 버전을 따로 개발할 필요가 없다는 점이 매력적이다.

> 시작에 앞서, 윈도우 이용자라면 WSL(Windows Subsystem for Linux)을 설치하는 것이 좋다. WSL은 윈도우에 서브시스템으로 리눅스를 탑재하는 것으로, 윈도우에서 리눅스를 다룰 수 있게 된다. WSL 세팅은 [윈도우에 우분투 돌리기](https://parksb.github.io/article/19.html)를 참고.

## CRNA

리액트 네이티브 개발 환경을 완전히 밑바닥에서 시작하는 것은 꽤 번거로운 일이다. 은혜롭게도 [Create React Native App](https://www.npmjs.com/package/create-react-native-app)이라는 좋은 도구가 있다. 이를 사용하면 기본적인 개발 환경을 완벽히 만들어준다.

```bash
# install it once globally
$ npm install -g create-react-native-app

# create a new application and run
$ create-react-native-app my-app
```

이렇게하면 my-app이라는 이름의 폴더가 만들어지고 그 안에 각종 파일들이 생긴 것을 볼 수 있다. 이제 실행시켜보자.

```bash
$ cd my-app
$ npm start
```

잘 작동한다면 터미널에 QR코드가 띄워진다. 어플리케이션은 Expo를 이용해 빌드할 것이고, Genymotion을 이용해 가상 머신에서 구동시킬 것이다.

## Expo

[Expo](https://expo.io/)는 리액트 네이티브 어플리케이션의 빌드를 돕는 툴이다. 네이티브 API에 접근하는 것도 쉽게 만들어주고, 안드로이드와 iOS 버전을 알아서 빌드해준다. 무엇보다 코드를 수정하면 바로 hot reloading 시켜주는 것이 가장 편하다.

GUI 툴인 Expo XDE를 사용한다면, 우선 Expo를 실행한 뒤 'Open existing project...'버튼을 클릭한다. 그리고 앞서 CRNA로 만든 my-app 폴더를 찾아 선택해주면 my-app을 알아서 빌드해준다.

CLI 툴을 이용하려면 먼저 `npm install -g expo-cli`로 expo-cli를 설치해준다. 그리고 my-app 폴더에서 `expo start`를 실행하면 my-app을 빌드해준다.

## Genymotion

[Genymotion](https://www.genymotion.com/)은 안드로이드 가상 머신을 구동하기 위한 도구다. [다운로드](https://docs.genymotion.com/desktop/Get_started/011_Windows_install/)하고, 가상 머신을 하나 만들면 준비가 끝난다.

## 실행

실행 단계는 다음과 같다.

1. my-app 폴더에서 `npm start`를 실행한다.
1. Expo에서 my-app 폴더를 선택해 빌드한다.
1. (가상 머신의 경우) Genymotion에서 가상 머신을 실행하고 Expo 어플리케이션에서 my-app을 선택한다.
1. (실단말의 경우) 휴대폰에 Expo를 설치하고, 터미널에 띄워진 QR코드를 스캔한다.

만약 expo-cli를 사용한다면 더 간단하다.

1. my-app 폴더에서 `expo start`를 실행한다.
1. (가상 머신의 경우) Genymotion에서 가상 머신을 실행하고 Expo 어플리케이션에서 my-app을 선택한다.
1. (실단말의 경우) 휴대폰에 Expo를 설치하고, 터미널에 띄워진 QR코드를 스캔한다.

자, 이렇게 잘되면 좋겠지만 안타깝게도 많은 에러가 발생할 것이다.

### Unable to start server

`npm start`를 하고 만날 수 있는 에러다.

```
$ npm start
9:34:11 AM: Unable to start server
See https://git.io/v5vcn for more information, either install watchman or run the following snippet:
sudo sysctl -w fs.inotify.max_user_instances=1024
sudo sysctl -w fs.inotify.max_user_watches=12288
...
npm ERR! code ELIFECYCLE
npm ERR! whyerrors@0.1.0 start: `react-native-scripts start`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the whyerrors@0.1.0 start script 'react-native-scripts start'.
npm ERR! Make sure you have the latest version of node.js and npm installed.
npm ERR! If you do, this is most likely a problem with the whyerrors package,
npm ERR! not with npm itself.
npm ERR! Tell the author that this fails on your system:
npm ERR!     react-native-scripts start
npm ERR! You can get information on how to open an issue for this project with:
npm ERR!     npm bugs whyerrors
npm ERR! Or if that isn't available, you can get their info via:
npm ERR!     npm owner ls whyerrors
npm ERR! There is likely additional logging output above.
...
```

커널 변수 `max_user_instances`와 `max_user_watches`의 값이 작아서 발생하는 오류다. 터미널에 찍힌대로 입력해주면 된다. sysctl은 커널 변수를 제어하는 명령어이며, -w 옵션은 이어서 나오는 값을 writing하겠다는 의미다.

```bash
$ sudo sysctl -w fs.inotify.max_user_instances=1024
$ sudo sysctl -w fs.inotify.max_user_watches=12288
```

만약 값을 영구적으로 바꾸고 싶다면 다음과 같이 하면 된다:

```bash
$ echo fs.inotify.max_user_instances=1024 | sudo tee -a /etc/sysctl.conf
$ echo fs.inotify.max_user_watches=12288 | sudo tee -a /etc/sysctl.conf
$ sudo sysctl -p
```

### Starting packager... 무한 로딩

마찬가지로 `npm start`를 하면 만날 수 있다.

```bash
$ npm start
...
Starting packager...
```

잘 되는 것 같지만 이 상태가 무한히 지속된다. 찾아보니 리눅스에만 생기는 문제인 것 같다길래 괜히 wsl을 썼나 싶었다. 일단 Expo 포럼에 올라온 질문 [Packager not loading on Linux](https://forums.expo.io/t/packager-not-loading-on-linux/2034)에 제시된 해결책을 써봤다.

```bash
$ rm -rf node_modules
$ npm install
```

아예 node_modules를 지우고 다시 설치하니 잘 돌아간다. 나중에 알았는데, node_modules 폴더가 아니라 package_lock.json 파일을 지우고 다시해도 해결할 수 있었다.

### 터미널에 QR코드가 나오지 않는 문제

`npm start`를 하면 실제 단말기에서 실행시킬 수 있는 QR 코드가 터미널에 찍혀 나와야 한다. 그런데 QR 코드가 있어야 할 자리가 텅텅 비어있었다. vscode에 등록된 이슈 [React native, QR Code not showing on terminal](https://github.com/Microsoft/vscode/issues/32648)에 따르면 vscode의 문제였다. powershell을 열어 npm start를 실행했다. 그랬더니 QR 코드가 제대로 나타났다.

다음날 아침 vscode를 업데이트하니 vscode의 통합터미널에서도 QR 코드가 잘 나왔다. expo에서 따로 QR 코드를 얻을 수 있다는 것은 나중에야 알았다.

### ADB server didn't ACK, failed to start daemon

Genymotion에 S7 가상 머신을 만들고 Expo에서 open android를 클릭했더니 다시 에러가 발생했다.

```
* daemon not running. starting it now on port 9000 *
ADB server didn't ACK
* failed to start daemon *
error: cannot connect to daemon
```

이쯤되니 리액트 네이티브하지 말라는 신의 계신인가 싶었다. 스택오버플로우에 올라온 질문 [Eclipse error "ADB server didn't ACK, filed to start daemon"](https://stackoverflow.com/questions/5703550/eclipse-error-adb-server-didnt-ack-failed-to-start-daemon)의 답변을 보고 `adb kill-server`도 해보고 `taskkill -f adb.exe`도 해봤지만 소용이 없었다. expo 설정에서 SDK의 경로를 수동으로 입력하기도 했지만 그것도 소용 없었다.

그리고 [두 번째 답변](https://stackoverflow.com/a/5829528/8463154)에 따라 sdk 버전을 업데이트하고 윈도우 환경변수까지 다시 설정했더니 해결됐다.

## 결론

맥을 사야겠다.
