import '../scss/index.scss';

import cover0Png from '../../assets/images/cover0.png';
import cover1Png from '../../assets/images/cover1.png';
import cover2Png from '../../assets/images/cover2.png';
import cover3Png from '../../assets/images/cover3.png';
import cover4Png from '../../assets/images/cover4.png';
import cover5Png from '../../assets/images/cover5.png';
import cover6Png from '../../assets/images/cover6.png';

const emojiImges = {
  0: { src: cover0Png, alt: '머리가 폭발하는 이모지.' },
  1: { src: cover1Png, alt: '조이스틱 이모지.' },
  2: { src: cover2Png, alt: '눈 이모지.' },
  3: { src: cover3Png, alt: '생각하는 이모지.' },
  4: { src: cover4Png, alt: '디자이너 이모지.' },
  5: { src: cover5Png, alt: '프로그래머 이모지.' },
  6: { src: cover6Png, alt: '웃는 이모지.' },
};
const emojiIndex: number = Math.floor(Math.random() * 7);

document.getElementById('main-emoji').setAttribute('src', emojiImges[emojiIndex].src);
document.getElementById('main-emoji').setAttribute('alt', emojiImges[emojiIndex].alt);
