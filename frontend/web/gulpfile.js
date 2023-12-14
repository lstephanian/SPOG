import gulp from 'gulp';
import shell from 'gulp-shell';
import pkg from 'gulp';
import nodemon from 'gulp-nodemon';
import download from 'gulp-download-stream';
import transform from 'gulp-transform';
import rename from 'gulp-rename';
import wait from 'gulp-wait';
import dotenv from 'dotenv';
import yaml from 'js-yaml';
import fs from 'fs/promises';

const { task, parallel } = pkg;
dotenv.config({path: './.env'});

task('vite-build', shell.task(['vite build --watch']));

task('nodemon', (cb) => {
  let started = false;
  return nodemon({
    script: 'app.js',
    ext: '*',
    ignore: ['node_modules/', 'dist/', 'abi/', 'public/custom/'],
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('download-abi', async () => {
  const contracts = yaml.load(await fs.readFile('./../../voting-rounds.yml', 'utf8'));

  for (const contract of contracts) {
    const abiUrl = `https://api-sepolia.arbiscan.io/api?module=contract&action=getabi&address=${contract.address}`;

    await new Promise((resolve) => {
      download(abiUrl)
        .pipe(wait(300))
        .pipe(rename(`${contract.address}.json`))
        .pipe(transform('utf8', (content) => JSON.parse(content).result))
        .pipe(gulp.dest('./abi/'))
        .on('end', () => {
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error downloading ABI for ${contract.address}: ${err.message}`);
          resolve();
        });
    });
  }
});

task('default', parallel('download-abi', 'vite-build', 'nodemon'));
