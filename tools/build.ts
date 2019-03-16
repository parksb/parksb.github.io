import { exec } from 'child_process';

console.log('\x1b[36m%s\x1b[0m', 'Run node-sass...');
console.log('node-sass ./app/src/scss --output ./app/src/css\n');
exec('node-sass --watch ./app/src/scss --output ./app/src/css', (err, stdout, stderr) => {
  if (err) {
    console.log('\x1b[31m%s\x1b[0m', stderr);
    return;
  }

  console.log(stdout);
  console.log(stderr);
});

console.log('\x1b[36m%s\x1b[0m', 'Run parcel...');
console.log('parcel build ./app/index.html -d ./parksb.github.io\n');
exec('parcel build ./app/index.html -d ./parksb.github.io', (err, stdout, stderr) => {
  if (err) {
    console.log('\x1b[31m%s\x1b[0m', stderr);
    return;
  }

  console.log(stdout);
  console.log(stderr);
});
