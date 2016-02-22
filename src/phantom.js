"use strict";

const winston = require('winston');
const execFile = require('child_process').execFile;
const phantomjs = require('phantomjs-prebuilt/lib/phantomjs');

module.exports = (options, pattern, timeout) => new Promise((resolve, reject) => {
  execFile(
    phantomjs.path,
    [
      'capture.js',
      pattern,
      JSON.stringify(options)
    ],
    {
      cwd: __dirname,
      timeout: timeout
    },
    (err, stdout, stderr) => {
      if (err) {
        reject(stdout + '\n' + stderr);
      } else {
        resolve(JSON.parse(stdout));
      }
    }
  );
});
