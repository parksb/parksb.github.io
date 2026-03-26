const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
};

export const logger = {
  info(msg: string) {
    console.log(`${colors.blue}[info]${colors.reset} ${msg}`);
  },
  success(msg: string) {
    console.log(`${colors.green}[ok]${colors.reset} ${msg}`);
  },
  warn(msg: string) {
    console.log(`${colors.yellow}[warn]${colors.reset} ${msg}`);
  },
  error(msg: string) {
    console.error(`${colors.red}[error]${colors.reset} ${msg}`);
  },
};
