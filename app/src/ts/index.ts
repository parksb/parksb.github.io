import '../scss/index.scss';

import cover0Png from '../../assets/images/cover0.png';
import cover1Png from '../../assets/images/cover1.png';
import cover2Png from '../../assets/images/cover2.png';
import cover3Png from '../../assets/images/cover3.png';
import cover4Png from '../../assets/images/cover4.png';
import cover5Png from '../../assets/images/cover5.png';
import cover6Png from '../../assets/images/cover6.png';

const emojiImges: string[] = [
  cover0Png,
  cover1Png,
  cover2Png,
  cover3Png,
  cover4Png,
  cover5Png,
  cover6Png,
];
const emojiIndex: number = Math.floor(Math.random() * 7);

document.getElementById('main-emoji').setAttribute('src', emojiImges[emojiIndex]);
