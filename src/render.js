"use strict";

const winston = require('winston');
const rimraf = require('rimraf');
const path = require('path');

const GIFEncoder = require('gifencoder');
const pngFileStream = require('png-file-stream');

module.exports = ({pattern, width, height, repeat, interval}) =>
  new Promise((resolve, reject) => {
    const encoder = new GIFEncoder(width, height)
      .createWriteStream({
        repeat: repeat,
        delay: interval,
        quality: 10
      });
    const stream = pngFileStream(pattern);

    stream.on('end', () => {
      rimraf(path.join(workingDirectory, `frame-${id}-*.png`), (err) => {
        if (err) {
          winston.error(err, 'Could not delete files', id);
        }
      });
    });

    return stream.pipe(encoder);
  });
