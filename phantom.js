"use strict";

const winston = require('winston');
const execFile = require('child_process').execFile;
const phantomjs = require('phantomjs-prebuilt/lib/phantomjs');

module.exports = (options, timeout) => new Promise((resolve, reject) => {
  execFile(
    phantomjs.path,
    [
      'capture.js',
      JSON.stringify(options)
    ],
    {
      cwd: __dirname,
      timeout: timeout
    },
    (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(stdout));
      }
    }
  );
});
