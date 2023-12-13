import gulp from 'gulp';
import shell from 'gulp-shell';
import pkg from 'gulp';
import nodemon from 'gulp-nodemon';
import download from 'gulp-download';
import transform from 'gulp-transform';
import rename from 'gulp-rename';
import dotenv from 'dotenv';
import { exec } from 'child_process';

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

gulp.task('download-abi', () => {
  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  const abiUrl = `https://api-sepolia.arbiscan.io/api?module=contract&action=getabi&address=${contractAddress}`;

  return download(abiUrl)
    .pipe(rename(`${contractAddress}.json`))
    .pipe(transform('utf8', (content) => { return JSON.parse(content).result }))
    .pipe(gulp.dest('./abi/'));
});

task('default', parallel('download-abi', 'vite-build', 'nodemon'));
