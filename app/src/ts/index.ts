import githubCalendar from 'github-calendar';

import '../scss/index.scss';
import 'github-calendar/dist/github-calendar.css';

new githubCalendar('#heatmap-container', 'ParkSB', { summary_text: '@ParkSB', global_stats: false, responsive: true });
