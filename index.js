"use strict";

const winston = require('winston');
const express = require('express');
const rimraf = require('rimraf');
const path = require('path');
const uuid = require('uuid').v4;
const execFile = require('child_process').execFile;
const phantomjs = require('phantomjs-prebuilt/lib/phantomjs');

var GIFEncoder = require('gifencoder');
var pngFileStream = require('png-file-stream');

const app = express();

app.use((req, res, next) => {
  winston.info(req.method, req.url, req.ip);
  next();
});

// WARNING - These are way too high for exposing to the internet.
// WARNING - Additionally there's no throttling of requests.
// WARNING - Use at your own risk!
const MAX_VIEWPORT = 1024 * 768;
const MAX_AREA = 500 * 500;
const MAX_FRAMES = 50;
const MAX_DURATION = 5000;
const MAX_LOADING = 5000;

const workingDirectory = path.join(__dirname, 'frames');

app.get('/', (req, res) => {
  const options = Object.assign({}, {
    url: 'about:blank',
    selector: 'body',
    viewport: '1024,768',
    frameInterval: '100',
    frameCount: '50',
    repeat: '0',
    quality: '10'
  }, req.query);

  options.viewport = options.viewport.split(',').map((v) => Number(v));
  if (options.viewport.width * options.viewport.height > MAX_VIEWPORT) {
    winston.warn('Max viewport exceeded');
    return res.status(500).send();
  }

  options.frameCount = Number(options.frameCount);
  if (isNaN(options.frameCount) || options.frameCount > MAX_FRAMES) {
    winston.warn('Max frames exceeded');
    return res.status(500).send();
  }

  options.frameInterval = Number(options.frameInterval);
  if (isNaN(options.frameInterval) ||
      options.frameCount * options.frameInterval > MAX_DURATION) {
    winston.warn('Max duration exceeded');
    return res.status(500).send();
  }

  const id = uuid();

  execFile(
    phantomjs.path,
    [
      'capture.js',
      JSON.stringify(Object.assign({}, options, {
        maxArea: MAX_AREA,
        pattern: path.join('frames', `frame-${id}-$i.png`)
      }))
    ],
    {
      cwd: __dirname,
      timeout: MAX_LOADING + MAX_DURATION
    },
    (err, stdout, stderr) => {
      if (err) {
        winston.warn(err, stdout, stderr);
        return res.status(500).send();
      }

      var bBox = JSON.parse(stdout);

      var encoder = new GIFEncoder(bBox.width, bBox.height)
        .createWriteStream({
          repeat: options.repeat,
          delay: options.frameInterval,
          quality: options.quality
        });

      res.writeHead(200, { "Content-Type": "image/gif" });

      pngFileStream(path.join(workingDirectory, `frame-${id}-*.png`))
        .pipe(encoder)
        .pipe(res);

      rimraf(path.join(workingDirectory, `frame-${id}-*.png`), (err) => {
        winston.error(err, 'Could not delete files', id);
      });
    }
  );
});

app.listen(3000);
