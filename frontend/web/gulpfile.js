import pkg from 'gulp';
const { task, series } = pkg;
import nodemon from 'gulp-nodemon';
import { exec } from 'child_process';

task('vite-build', (cb) => {
  exec('vite build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

task('nodemon', (cb) => {
  let started = false;

  return nodemon({
    script: 'app.js',
    ext: '*',
    ignore: ['node_modules/'],
    env: {'PROJECT_ID': '98e764db0ed63f35c3158eaec67adedb'},
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

task('default', series('vite-build', 'nodemon'));
