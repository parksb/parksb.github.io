---
id: 41
title: "아치 리눅스로 15년차 넷북 되살리기"
subtitle: "Eee PC 1000HE 위에 올린 아치 리눅스 32"
date: "2023.09.12"
---

우리집에는 2009년 구입한 넷북이 있다.

![두껍고 작은 Asus Eee PC 1000HE 넷북.](/images/b02b09c6-db90-4570-a7f0-aafa29bc3ae9.webp)

Asus Eee PC 1000HE에는 인텔 아톰 N280과 DDR2 1GB 램이 탑재되어 있다. 아톰 N 시리즈는 인텔이 넷북을 위해 만든 저가, 저성능 CPU다. L1 캐시 56KB, L2 캐시 512KB가 제공되며, 클럭 속도는 1.667GHz다. 2023년 출시된 저가형 노트북용 프로세서 인텔 코어 i3 N305에는 L1 캐시 768KB, L2 캐시 4MB가 제공되고, 속도가 3.8GHz라는 점을 생각해보면 얼마나 열악한 성능인지 체감할 수 있다.

넷북이라는 정체성을 고려해 타협된 스펙이니 "성능이 이렇게나 안 좋다"며 따지는 것이 큰 의미는 없을 것이다. 당시에도 노트북과 비교해 좋은 성능은 아니었지만, 문서 편집이나 웹 서핑 등 가벼운 작업을 하는 데는 무리가 없었다. 그러나 2012년쯤부터는 일상적인 작업이 어려울 정도가 되었다. 프로그램에는 더 많은 기능이 추가되고 있었고, 웹 사이트는 더욱 인터랙티브해지고 있었으며, 넷북의 작은 HDD는 노후화되고 있었다. 결국 넷북의 자리는 울트라북이 대체했다.

그렇게 우리집 넷북은 창고에 잠들었다.

## 새 운영체제

그러다 10여 년이 흐른 2023년, 갑자기 그 넷북이 떠올랐다. 창고에서 꺼낸 넷북은 들어갈 때 모습 그대로였고, 부팅 후 나타난 촌스러운 윈도우XP UI도 그때 그 모습이었다. 탐색기를 여는 데 수 초가 걸렸고, 탐색기가 열리는 동안 커서가 버벅거렸다. 성능이 더 나빠진 것인지, 원래 이랬는데 그때는 이 정도도 빠르다고 느꼈는지 잘 기억나지 않았다. 넷북이 다시 창고를 벗어난 이상, 이 넷북을 되살려서 서버가 되든, 유튜브 머신이 되든 다시 사용해보겠다고 마음 먹었다.

우선 2014년에 지원이 종료된 윈도우XP를 대체할 필요가 있다고 생각했다. 윈도우7 이후의 윈도우 운영체제들은 최소 1GB 메인 메모리를 요구했다. 넷북에 장착된 메인 메모리가 딱 1GB 램이었기 때문에 보다 가벼운 운영체제를 설치해야 쾌적한 사용이 가능하겠다고 생각했다. 우분투는 최소 512MB 메인 메모리를 요구했는데, 과거 저성능 노트북에 우분투를 설치했을 때 그다지 좋은 성능을 체감하지 못했다.

나에게는 최소한의 기능만을 갖춘 아주 가벼운 운영체제가 필요했다. 불필요한 기본 기능이 포함되어 있지 않고, 밑바닥부터 나의 넷북만을 위한 환경을 구축할 수 있어야 했다. 답은 정해져 있었다. 아치 리눅스였다. 아치 리눅스는 단순성, 현대성, 실용성, 사용자 중심, 범용성을 원칙으로 하는 리눅스 배포판이다. 안 그래도 예전부터 아치 리눅스를 사용해보고 싶었는데 좋은 기회라고 생각했다. 설정 과정에서 운영체제에 대해 많은 공부를 하게 된다니 개강 직전에 시작하기 좋은 취미이기도 했다.

## 설치 전

아치 리눅스는 2017년 이후로 x86 아키텍처에 대한 공식적인 지원을 종료했다. 아톰 N2xx 프로세서는 32비트만을 지원하므로 나는 선택의 여지 없이 커뮤니티 주도로 유지보수되고 있는 [아치 리눅스 32](https://archlinux32.org/)를 사용해야만 했다. 아치 리눅스 32의 설치 방법은 아치 위키에 설명된 [아치 리눅스 설치 가이드](https://wiki.archlinux.org/title/installation_guide)와 크게 다르지 않았지만, 제한적인 성능으로 인해 예상치 못한 우여곡절이 있었다. 이 글에서는 넷북에 아치 리눅스 32를 설치한 개인적인 경험을 상세히 기록하고자 한다.

### 부팅 매체 준비

먼저 아치 리눅스 디스크 이미지가 필요하다. [아치 리눅스 32 다운로드 페이지](https://www.archlinux32.org/download/)에서 이미지 파일(`.iso`)과 시그니처 파일(`.sig`)을 받고, `gpg` 명령으로 위변조된 이미지인지 검증한다.

```
$ gpg --keyserver-options auto-key-retrieve --verify archlinux32-2023.03.02-i686.iso.sig
```

문제가 없다면 부팅 매체를 만든다. 나는 윈도우 데스크탑에서 [Rufus](https://rufus.ie/)를 이용하여 앞서 받은 ISO 파일을 USB에 구웠다. 그리고 넷북에 USB를 꽂은 뒤 BIOS(Basic Input/Output System)에 진입해 USB를 1순위 부팅 옵션으로 설정하고 재부팅했다. 이렇게 하면 컴퓨터가 하드디스크 대신 USB로 부팅하게 된다.

### 인터넷 연결

아치 리눅스 설치 이미지는 [zsh](https://www.zsh.org/)을 기본 셸로 제공한다. 아치 리눅스를 설치하려면 인터넷에 연결되어 있어야 한다. 먼저 네트워크 인터페이스가 활성화되어 있는지 확인한다.

```
$ ip link
1: lo ... state UNKNOWN ...
   link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: enp3s0 ... state DOWN ...
   link/ether xx:xx:xx:xx:xx:xx brd ff:ff:ff:ff:ff:ff
4: wlan0 ... state UP ...
   link/ether xx:xx:xx:xx:xx:xx brd ff:ff:ff:ff:ff:ff
```

여기서 `lo`는 루프백 인터페이스다. 루프백 인터페이스는 시스템이 자기 스스로에게 연결하기 위해 사용하는 가상의 네트워크 인터페이스다. 아이피 127.0.0.1은 이 인터페이스에 할당된 루프백 아이피다. `enp3s0`는 메인보드의 3번 PCI 버스(`p3`), 0번 슬롯(`s0`)을 사용하는 이더넷 디바이스(`en`)에 대응되는 인터페이스다. 이더넷은 유선 네트워크를 위한 규격이다. `wlan0`는 무선랜 인터페이스다. 와이파이에 연결할 것이니 `wlan0`의 `state`가 `UP`임을 확인했다. 이어서 `rfkill`로 차단된 인터페이스가 있는지 확인한다.

```
$ rfkill
ID    TYPE         DEVICE             SOFT         HARD
0     wlan         eeepc-wlan         unblocked    unblocked
1     bluetooth    eeepc-bluetooth    unblocked    unblocked
2     wwan         eeepc-wwan3g       unblocked    unblocked
...
```

유선 연결이 가능하다면 바로 LAN 케이블을 꽂으면 되지만, 와이파이에 연결하려면 `iwctl`을 이용해 직접 액세스 포인트를 검색하고 연결해야 한다. `iwctl`은 인텔이 만든 무선 네트워크 데몬 [`iwd`(iNet wireless daeom)](https://wiki.archlinux.org/title/iwd)가 제공하는 클라이언트 프로그램이다. 아치 리눅스 설치 이미지는 `iwd`를 기본으로 제공한다.

```
$ iwctl

[iwctl]# device list
                          Devices
-----------------------------------------------------------
Name     Address              Powered    Adapter    Mode
-----------------------------------------------------------
wlan0    xx:xx:xx:xx:xx:xx    on         phy0       station

[iwctl]# station wlan0 scan

[iwctl]# station wlan0 get-networks
        Available networks
----------------------------------
Network name    Security    Signal
----------------------------------
iptime          psk         ****
iptime_2.4G     psk         ****

[iwctl]# station wlan0 connect iptime_2.4G
Type the network passphrase for iptime_2.4G psk.
Passphrase: ********

[iwctl]# exit
```

넷북의 랜카드가 5GHz 네트워크를 지원하지 않아 2.4GHz 네트워크에 연결할 수 밖에 없었다. 마지막으로 [archlinux32.org](https://archlinux32.org/)에 핑을 보내 인터넷에 연결이 잘 됐는지 확인한다.

```
$ ping -c3 archlinux32.org
```

### 시스템 시계 설정

시스템 시계를 업데이트한다. 먼저 NTP(Network Time Protocol)를 이용하도록 설정하고, 시계가 정확한지 확인한다. NTP는 서버로부터 정확한 시간을 받아 시스템 시계와 동기화하기 위한 프로토콜이다. [철도 시간표가 유닉스 시간이 되기까지](https://parksb.github.io/article/39.html)에서 간략히 설명한다.

```
$ timedatectl set-ntp true
$ timedatectl
```

### 디스크 파티셔닝

`fdisk`를 이용해 컴퓨터에 어떤 디스크가 장착되어 있는지 확인할 수 있다.

```
$ fdisk -l
Disk /dev/sda: 14.8 Gib, x bytes, x sectors
Disk model: Flash Disk
...
Disk /dev/sdb: 149.0 GiB, x bytes, x sectors
Disk model: ST9160410AS
...
```

`sda`는 설치 USB이고, `sdb`가 넷북에 장착된 HDD이므로 `sdb`를 선택한다.

```
$ fdisk /dev/sdb
```

기존 파티션은 윈도우에 맞게 하나의 HDD를 C 드라이브, D 드라이브로 나눠 사용하고 있었고, 추가로 EFI 파티션과 복구 파티션이 지정되어 있었다. 나는 더 이상 필요하지 않은 기존 파티션을 모두 지우고, 완전히 새롭게 구성하고자 했다. 그러려면 우선 시스템의 메인보드에 대해 알아야 했다.

메인보드의 ROM에는 시스템에 전원이 공급되면 가장 먼저 실행되어 부팅에 필요한 하드웨어를 초기화하는 펌웨어가 설치되어 있다. 펌웨어의 종류에는 BIOS와 EFI(Extensible Firmware Interface), UEFI(Unified Extensible Firmware Interface)로 크게 세 가지가 있다. EFI는 BIOS를 개선한 펌웨어고, UEFI는 EFI를 개선한 펌웨어이기 때문에 최근에는 UEFI가 제공되는 것이 일반적이지만, 구형 메인보드는 보통 BIOS를 제공했다. 그런데 Eee PC 1000HE의 펌웨어는 분명 BIOS인데도 불구하고 EFI 파티션이 만들어져 있었다. 나중에 알고보니 EFI 파티션은 펌웨어가 EFI이기 때문에 존재하는 것이 아니라, BIOS의 "Boot Booster" 옵션을 지원하기 위해 만들어진 것이었다[^jonifen14]. 컴퓨터를 켜면 BIOS가 하드웨어를 초기화하기 전에 시스템의 각종 장치를 진단하는 POST(Power-On Self Test) 과정을 거치는데, 이로 인해 부팅에 수 초를 소요하게 된다. "Boot Booster"는 EFI 파티션에 POST 정보를 캐시함으로써 부팅 지연 시간을 줄여준다.

![American Megatrends International BIOS의 POST 화면.](/images/5426bee0-fd26-42e4-b081-fda577126d1f.webp)
_American Megatrends International BIOS의 POST 화면. (CC0)_

파티셔닝 형식에는 MBR(Master Boot Record)과 GPT(GUID Partition Table)가 있다. MBR은 저장장치의 첫 512 바이트를 차지하여 440 바이트에는 부트스트랩 코드를, 6 바이트에는 디스크 서명을, 64 바이트에는 16 바이트씩 최대 4개 파티션에 대한 파티션 테이블을, 나머지 2 바이트에는 부트 서명을 저장한다. 한편 GPT는 MBR의 각종 제약을 개선한 파티셔닝 형식으로, UEFI 명세의 일부이기도 하다. GPT 형식을 사용하면 MBR에 비해 더 많은 주 파티션을 만들 수 있으며, 더 큰 파티션도 만들 수 있다. 또한 MBR과 달리 별도의 부트 파티션을 사용한다. 여기서 나는 두 가지 실수를 했는데, 하나는 BIOS에는 GPT를 사용할 방법이 없다는 착각[^archwiki-partitioning-trick]으로 MBR을 선택한 것이고, 다른 하나는 EFI 파티션의 용도를 모른 채 아래와 같이 일반적인 MBR 형식으로 파티셔닝한 것이다. 조금 아쉽지만 굳이 다시 설정하지는 않았다.

| Mount point | Partition | Partition type ID | Boot flag |
|-------------|-----------|-------------------|-----------|
| [SWAP]      | /dev/sdb1 | 82 (Linux swap)   | No        |
| /           | /dev/sdb2 | 83 (Linux)        | Yes       |

스왑 파티션은 메인 메모리 용량이 부족한 경우 주 기억장치 공간의 일부를 메모리처럼 사용하기 위해 필요하다. 아치 위키는 스왑 파티션에 최소 512MB 이상 할당할 것을 권장하고 있다. 하지만 이 정도로는 부족하다. 메인 메모리가 1GB인 이 넷북에서 스왑 파티션까지 작게 잡으면 시도때도 없이 "No space left on device" 에러를 마주하게 될 것이다. RHEL은 메인 메모리가 2GB 이하인 경우에는 메인 메모리 용량의 2배를 스왑 파티션에 할당할 것을 권고한다. 따라서 1GB 메인 메모리를 가진 넷북에서는 스왑 파티션을 2GB로 잡으면 된다. 다만 소스를 직접 빌드할 때 4GB 이상의 메모리를 요구하는 경우가 있기 때문에 넉넉히 4GB로 잡았다. 스왑 파티션의 크기를 메인 메모리보다 크게 할당하는 것은 하이버네이션(Hibernation)을 생각해서라도 좋은 선택이다.

```
Command (m for help): n

Command action
e    extended
p    primary partition (1-4)
p

Partition number (1-4): 1

First sector (2048-y, default 2048): <enter>
Using default value 2048

Last sector, +sectors or +size(K,M,G) (2048-y, default y): +4G
```

방금 만든 스왑 파티션의 타입을 82(Linux swap)으로 변경한다.

```
Command (m for help): t
Partition number (1-4): 1
Hex code: 82
Changed system type of partition 2 to 82
```

이어서 루트 파티션을 만든다. 루트 파티션은 아치 리눅스가 설치될 파티션이다.

```
Command (m for help): n

Command action
e    extended
p    primary partition (1-4)
p

Partition number (1-4): 2

First sector (x-y, default x): <return>
Using default value x

Last sector, +sectors or +size(K,M,G) (x-y, default y): <return>
Using default value y
```

마지막으로 결과를 확인해본다.

```
Command (m for help): p
Disk /dev/sdb: 149.0 GiB, x bytes, x sectors
Disk model: ST9160410AS
...
Device       Boot    Start    End    Sectors    Size    Id    Type
/dev/sdb1            2048     y      z          4G      82    Linux swap / Solaris
/dev/sdb2            x        y      z          145G    83    Linux
```

후술하겠지만, [GRUB](https://www.gnu.org/software/grub/) 부트로더를 사용할 생각으로 부트 플래그는 지정하지 않았다. (GRUB은 부트 플래그를 무시한다.) 이제 저장(`w`)한 뒤 `fdisk`를 종료(`q`)한다.

```
Command (m for help): w
Command (m for help): q
```

루트 파티션의 파일 시스템을 설정한다. 리눅스 파일 시스템으로는 일반적으로 [ext4](https://wiki.archlinux.org/title/Ext4)를 사용하므로 `sdb2`를 ext4로 포맷한다.

```
$ mkfs.ext4 /dev/sdb2
```

`mkswap`으로 앞서 만든 스왑 영역을 스왑 파티션으로 초기화하고, 활성화한다.

```
$ mkswap /dev/sdb1
$ swapon /dev/sdb1
```

## 설치

본격적으로 설치를 시작한다. 아치 리눅스를 설치할 루트 파티션에 접근하기 위해 루트 파티션을 `/mnt` 디렉토리에 마운트한다.

```
$ mount /dev/sdb2 /mnt
```

이제 필수 패키지를 설치한다. `pacstrap`은 마운트된 루트 디렉토리에 패키지를 설치하는 명령이다. 이를 이용해 `/mnt` 디렉토리에 리눅스 커널과 모듈, 펌웨어 파일을 받는다. 하지만 바로 패키지를 설치하면 서명을 신뢰할 수 없다는 에러가 발생한다. 먼저 아치 리눅스의 패키지 매니저 `pacman`으로 아치 리눅스 32의 PGP 키링 `archlinux32-keyring`을 설치해야 한다.

```
$ pacman -S archlinux32-keyring
$ pacstrap -K /mnt base linux linux-firmware
```

설치가 끝나면 `fstab` 파일을 생성한다. `fstab` 파일은 디스크 파티션 등 파일 시스템에 대한 정보를 담고 있으며, 시스템이 부팅될 때 설정에 따라 파일 시스템을 자동으로 마운트해준다. 아치 리눅스 설치 이미지가 제공하는 `genfstab`는 자동으로 `fstab` 내용을 생성해준다.

```
$ genfstab -U /mnt >> /mnt/etc/fstab
```

루트를 `/mnt` 디렉토리로 변경한다.

```
$ arch-chroot /mnt
```

지금부터는 `/mnt` 디렉토리가 루트 디렉토리인 상태, 즉, 아치 리눅스 시스템 안에 들어와 있다고 생각해야 한다.

### 시스템 설정

우선 `/usr/share/zoneinfo` 디렉토리 아래에 있는 시간대 파일을 `/etc/localtime`으로 링크해 로컬 시간대를 지정해준다. 대한민국 표준시를 사용하기 위해 `ROK`를 선택했다.

```
$ ln -sf /usr/share/zoneinfo/ROK /etc/localtime
```

`hwclock`을 이용해 시스템 시계로 하드웨어 시계를 설정한다. `/etc/adjtime`의 타임스탬프가 업데이트된다.

```
$ hwclock --systohc
```

로케일 파일을 생성한다.

```
$ locale-gen
```

호스트네임을 설정한다.

```
$ echo eee-pc-1000he > /etc/hostname
```

루트 계정의 패스워드를 설정한다.

```
$ passwd
```

이로써 기본적인 설정을 마쳤다.

### 부트로더 설정

컴퓨터가 켜지면 BIOS가 POST를 수행하고, 부팅에 필요한 하드웨어를 초기화한다. 곧이어 BIOS에서 1순위 부팅 옵션으로 설정된 디스크의 첫 440 바이트을 실행하는데, 이 영역에 있는 MBR 부트스트랩 코드가 부트로더를 실행한다. 그리고 부트로더는 커널을 로드하여 운영체제를 실행한다[^archwiki-boot-process-system-init]. 다양한 부트로더가 있지만, 나는 익숙한 GRUB을 선택했다. GRUB은 BIOS, MBR, ext4를 모두 지원하기 때문에 현재 환경에 사용하기에도 적합했다.

일반적인 패키지를 설치하듯 `pacman`으로 GRUB을 설치할 수 있다. 다만 바로 설치를 시도하면 서명을 신뢰할 수 없다는 에러가 발생하니 앞서 한 것과 같이 `archlinux32-keyring`을 먼저 받는다.

```
$ pacman -S archlinux32-keyring
$ pacman -S grub
```

부팅 디스크를 지정해 GRUB을 설치한다. 인자로 넘긴 `/dev/sdb`가 파티션이 아닌 디스크임에 주의한다.

```
$ grub-install --target=i386-pc /dev/sdb
```

GRUB 설정 파일을 생성한다.

```
$ grub-mkconfig -o /boot/grub/grub.cfg
```

이제 시스템이 부팅될 때 `/boot/grub` 디렉토리에 설치된 GRUB이 `/boot` 디렉토리 아래에 있는 아치 리눅스 커널 `vmlinuz-linux`를 로드할 것이다. 이 시점에 아치 리눅스 설치가 끝났다고 할 수 있지만, 여기서 바로 재부팅하기 전에 네트워크 설정을 마쳐야 한다.

### 네트워크 설정

지금 네트워크 설정을 하지 않으면 아치 리눅스를 설치한 뒤 인터넷에 연결하지 못해 완전히 고립되는 상황에 놓일 수 있다. 나는 아치 리눅스 설치 이미지에서 사용하는 단순한 구성인 [`systemd-networkd`](https://wiki.archlinux.org/title/systemd-networkd) + [`systemd-resolved`](https://wiki.archlinux.org/title/systemd-resolved) + `iwd` 조합을 그대로 따르고자 했다. `systemd-networkd`는 네트워크 설정을 관리하는 시스템 데몬으로, 유선 네트워크 연결에 필요한 파일이 포함되어 있다. 먼저 유선 어댑터 설정을 작성한다.

```sh
$ cat <<EOF > /etc/systemd/network/20-wired.network
[Match]
Name=enp3s0

[Network]
DHCP=yes
EOF
```

무선 어댑터 설정도 작성한다. `IgnoreCarrierLoss` 옵션은 시스템이 다른 액세스 포인트에 로밍(Roaming)하는 중에 `systemd-networkd`가 현재 인터페이스 설정을 잠시 유지하도록 한다. 로밍 도중 짧은 시간 동안 손실을 무시함으로써 다운타임을 줄일 수 있다.

```sh
$ cat <<EOF > /etc/systemd/network/25-wireless.network
[Match]
Name=wlan0

[Network]
DHCP=yes
IgnoreCarrierLoss=3s
EOF
```

`systemd-resolved`는 DNS를 위한 서비스를 제공한다. `systemd-resolved` 설정은 `stub-resolv.conf` 설정을 링크해 사용한다.

```
$ ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
```

따로 설치해야 하는 패키지는 무선 네트워크에 연결하기 위한 `iwd`뿐이다.

```
$ pacman -S iwd
```

`iwd` 설정 파일도 작성한다. `EnableNetworkConfiguration` 옵션을 `true`로 하면 `iwd`가 네트워크 인터페이스를 IP 주소로 설정하도록 한다. 동적 주소를 사용하는 경우 빌트인된 DHCP 클라이언트로 IP를 할당 받는다. DHCP의 동작 과정은 [인터넷이 동작하는 아주 구체적인 원리](https://parksb.github.io/article/36.html)에서 설명한다. `NameResolvingService` 옵션은 DNS 결정 방식을 설정한다. `systemd`는 기본 값이기도 하다.

```sh
$ cat <<EOF > /etc/iwd/main.conf
[General]
EnableNetworkConfiguration=true

[Network]
NameResolvingService=systemd
EOF
```

`hosts` 파일을 작성한다. 이 파일은 DNS가 도메인으로 아이피 주소를 얻을 때 가장 먼저 참조하는 파일이다.

```sh
$ cat <<EOF > /etc/hosts
127.0.0.1   localhost
::1         localhost
127.0.1.1   eee-pc-1000he
EOF
```

시스템이 부팅되면 자동으로 네트워크 서비스들이 실행되도록 등록한다.

```
$ systemctl enable iwd systemd-networkd systemd-resolved
```

`/mnt`로 설정된 루트를 빠져나온다.

```
$ exit
```

## 설치 후

드디어 설치가 끝났다. `/mnt` 디렉토리에 마운팅된 파티션을 언마운트한다.

```
$ umount -R /mnt
```

시스템을 종료하고 재부팅한다. 이때 BIOS에 진입해 1순위 부팅 옵션을 USB가 아닌 하드디스크로 지정한 뒤, USB를 제거한다. 이제 컴퓨터가 하드디스크에 올린 시스템으로 부팅되며, GRUB에서 아치 리눅스 32를 선택하면 운영체제가 실행된다. 이후 루트 계정으로 로그인한 뒤 각종 필요한 패키지를 설치했다.

```
$ pacman -S coreutils sudo which git wget openssh neovim tmux fish
```

또한 아치 리눅스의 [General recommendations](https://wiki.archlinux.org/title/General_recommendations) 문서를 참고해 각종 권장 사항을 반영했다.

### Arch User Repository

AUR(Arch User Repository)은 아치 리눅스의 공식 패키지 저장소 외에 커뮤니티 주도로 운영되는 저장소다. 필요한 패키지가 공식 저장소가 아닌 AUR에 올라와 있는 경우가 종종 있다. AUR에서 직접 패키지를 받으려면 번거로운 절차를 거쳐야 하기 때문에 AUR에 대한 다양한 작업을 자동화하고, 사용자 친화적인 인터페이스를 제공하는 헬퍼를 사용하는 것이 여러모로 건강에 좋다.

Pacman 래퍼인 [yay](https://github.com/Jguer/yay) 또는 [paru](https://github.com/Morganamilo/paru)를 사용하면 `pacman`을 사용하듯 쉽게 AUR로부터 패키지를 설치할 수 있다. 어떤 것을 사용해도 되지만 둘 다 x86 바이너리를 제공하지 않으므로 직접 빌드해야 한다.

```
$ sudo pacman -S --needed base-devel
$ git clone https://aur.archlinux.org/paru.git
$ cd paru
$ makepkg -si
```

4GB를 스왑 파티션에 할당했음에도 빌드 도중에 "No space left on device" 에러가 발생했다. 무시하고 다시 빌드를 시작하면 직전에 캐시한 빌드 데이터를 참조하여 빌드를 재개하기 때문에 성공적으로 빌드를 마칠 수 있다.

### 데스크탑 환경

아치 리눅스에는 데스크탑 환경(Desktop Environment, DE)이 포함되어 있지 않기 때문에 직접 설정해야 한다. DE는 아이콘이나 툴바, 배경화면과 같은 GUI 요소와 윈도우 매니저(Window Manager)를 함께 제공하기 때문에 쉽게 GUI를 구축할 수 있게 해준다.

유명한 DE로 GNOME이 있지만, 넷북에는 더 가벼운 DE가 필요했다. 나는 가벼운 DE로 유명한 LXDE(Lightweight X11 Desktop Environment)의 뒤를 잇는 LXQt를 선택했다. LXQt는 X Window System(X11 또는 그냥 X라고 부른다.) 위에서 동작한다. X11은 GUI 환경을 위한 프레임워크를 제공하며, 서버-클라이언트 모델을 따르고 있다. 'X 서버'라고 부르는 디스플레이 서버는 입력 장치로부터 이벤트를 받아 'X 프로토콜'을 이용해 클라이언트에게 전달한다. 이때 클라이언트는 브라우저와 같은 유저 애플리케이션부터 DE, 윈도우 매니저, 툴킷(GTK, Qt) 등 서버 위에 놓인 레이어를 통틀어 의미한다. 입력 이벤트를 받은 클라이언트가 서버에게 GUI 요청을 보내면 서버는 요청된 내용에 따라 출력 장치에 화면을 구성한다[^christyler07].

![X11 서버-클라이언트 모델 다이어그램.](/images/d6e212d2-dda9-4bce-ab49-0e677fa31272.svg)
_X11 서버-클라이언트 모델. (Wikimedia Commons, CC BY-SA 3.0)_

지금은 X11의 문제를 개선하고 현대적인 커널에 맞게 설계된 Wayland가 그 자리를 대체하고 있는데, 나는 LXQt를 사용하기 위해 X11을 설치하기로 했다. `xorg` 패키지에는 X11 서버를 비롯한 다양한 유틸리티 패키지를 포함하고 있다. `xorg-xinit`은 `startx` 명령으로 X11 서버를 수동으로 실행할 수 있도록 해주는 프로그램이다. 이와 함께 LXQt와 아이콘 세트도 설치한다.

```
$ pacman -S xorg xorg-xinit lxqt breeze-icons
```

`startx` 명령은 기본적으로 홈 디렉토리의 `.xinitrc` 파일에 설정된 내용에 따라 X11 세션을 초기화한다. 만약 홈 디렉토리에 `.xinitrc` 파일이 없으면 `/etc/X11/xinit/xinitrc` 파일을 참조한다. 유저에 따라 설정을 다르게 하기 위해 기본 `xinitrc` 파일을 홈 디렉토리로 복사한다.

```
$ cp /etc/X11/xinit/xinitrc ~/.xinitrc
```

기본 설정은 Twm, xorg-xclock, Xterm을 실행하도록 되어있다. 이 내용을 모두 지우고 `exec startlxqt`를 추가한다. 이어서, 로그인하면 자동으로 X11 세션을 시작하도록 `.profile` 파일에 스크립트를 작성한다.

```sh
if [ -z "${DISPLAY}" ] && [ "${XDG_VTNR}" -eq 1 ]; then
  exec startx
fi
```

파이어폭스를 설치하고 LXQt 환경에서 실행시켜봤다. 넷북이 버거워한다.

![LXQt 환경에서 파이어폭스 브라우저를 실행한 모습.](/images/5609429a-bc49-447a-8571-25d0ae3e19d2.webp)

넷북을 서버로 사용하기 위해 `*-desktop` 계정으로 로그인할 때만 LXQt를 실행하고, 그 외에는 CLI를 사용하도록 했다. 필요하다면 항상 DE를 실행하도록 할 수도 있고, 패키지를 설치해 LXQt의 추가적인 기능을 활성화할 수 있다.

### 램 업그레이드

Eee PC 1000HE의 메인 메모리는 DDR2 1GB SO-DIMM 램이다. DDR2는 2003년 표준화된 SDRAM 인터페이스이며, 이후 2007년 DDR3, 2014년 DDR4를 거쳐 2020년에는 DDR5까지 나왔다. DIMM(Dual In-line Memory Module)은 여러 개의 램을 하나의 PCB에 올린 램 막대를 의미한다. SO-DIMM(Small Outline DIMM)은 DIMM의 길이를 절반 정도로 줄여 작은 디바이스에 사용할 수 있도록 만든 규격이다.

1GB 램으로 소스를 빌드하면서 메모리 부족으로 인한 에러를 여러 번 만났기에 우선 램을 업그레이드할 필요가 있다고 생각했다. 그런데 넷북의 인텔 아톰 N280 프로세서가 지원하는 램 최대 용량은 2GB에 불과했다. 요즘도 DDR2 램을 팔긴 하는지 의심하며 6900원짜리 2GB 램을 주문했다. (배송비가 3000원이었다.)

![넷북 후면에 장착된 2GB 램.](/images/099994db-2468-44ad-9339-db34e1580d4b.webp)

새 램으로 교체한 뒤 잘 인식하는지 확인해봤다.

```
$ free -h
         total ...
Mem:     1.9Gi ...
Swap:    4.0Gi ...
```

큰 기대를 한 것은 아니지만, 병목은 HDD와 CPU였기 때문에 눈에 띄는 성능 개선을 체감하지는 못했다. 넷북을 완전히 분해해서 아예 하드웨어를 하나씩 교체해보는 것도 재밌겠다 싶었다.

[^jonifen14]: [Jon Cain, "Boot Booster (EFI) Partition on an Asus EeePC 1005P", 2014.](https://jonifen.co.uk/blog/boot-booster-efi-partition-asus-eee-1005p/)
[^archwiki-partitioning-trick]: [ArchWiki, "Partitioning: Tricking old BIOS into booting from GPT".](https://wiki.archlinux.org/title/partitioning#Tricking_old_BIOS_into_booting_from_GPT)
[^archwiki-boot-process-system-init]: [ArchWiki, "Arch boot process: System initialization".](https://wiki.archlinux.org/title/Arch_boot_process#System_initialization)
[^christyler07]: Chris Tyler, "X Power Tools", O'Reilly, 2007.
