"use strict";

const path = require('path')
const execFile = require('child_process').execFile;

const binPath = require('phantomjs-prebuilt/lib/phantomjs').path;

execFile(
  binPath,
  ['capture.js'],
  {
    cwd: __dirname,
    timeout: 10000
  },
  (err, stdout, stderr) => {
    console.log('error', err);
    console.log(stdout);
    console.error(stderr);
  })
