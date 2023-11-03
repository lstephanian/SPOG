import nodemon from 'gulp-nodemon';
import { exec } from 'child_process';
import gulp from 'gulp';
import pkg from 'gulp';
import path from 'path';
import fs from 'fs';
import solc from 'solc';

const { task, series } = pkg;

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
    // env: {'PROJECT_ID': ''},
  }).on('start', () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('compile-abi', (cb => {
  const contractSource = '../../contracts/Round.sol';
  var input = {
    language: 'Solidity',
    sources: {'Round.sol': {content: fs.readFileSync(contractSource, 'utf8')}},
    settings: {outputSelection: {'*': {'*': ['*']}}}
  }

  var output = JSON.parse(solc.compile(JSON.stringify(input)));
  for (var contractName in output.contracts['Round.sol']) {
    console.log(contractName + ': ' + output.contracts['Round.sol'][contractName].evm.bytecode.object);
  }

  cb();
}));

task('default', series('vite-build', 'nodemon'));
