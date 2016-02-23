"use strict";

const winston = require('winston');
const execFile = require('child_process').execFile;
const phantomjs = require('phantomjs-prebuilt/lib/phantomjs');

module.exports = (options, pattern, timeout) => new Promise((resolve, reject) => {
  const childProcess = execFile(
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
    (err, stdout) => {
      if (err) {
        if (childProcess.exitCode === 1) {
          return reject(JSON.parse(stdout));
        }
        if (err.killed) {
          return reject('Timed out');
        }
        return reject(err);
      }
      try {
        resolve(JSON.parse(stdout));
      }
      catch (e) {
        reject(e);
      }
    }
  );
});
