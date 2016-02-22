"use strict";

const winston = require('winston');
const express = require('express');
const expressValidator = require('express-validator');
const rimraf = require('rimraf');
const path = require('path');
const uuid = require('uuid').v4;
const phantom = require('./phantom');
const schema = require('./schema');

var GIFEncoder = require('gifencoder');
var pngFileStream = require('png-file-stream');

const app = express();
app.use(expressValidator());
app.use((req, res, next) => {
  winston.info(req.method, req.url, req.ip);
  next();
});

const workingDirectory = path.join(__dirname, 'frames');

app.get('/', (req, res) => {
  req.checkQuery(schema);
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400)
      .send(`Parameter ${errors[0].param} not specified or invalid`);
  }

  const pattern = path.join(__dirname, 'frames', `frame-${uuid()}-*.png`);

  phantom(req.query, pattern, process.env.TIMEOUT)
    .then((bBox) => {
      const encoder = new GIFEncoder(bBox.width, bBox.height)
        .createWriteStream({
          repeat: req.query.repeat,
          delay: req.query.interval,
          quality: 10
        });

      const stream = pngFileStream(pattern)
        .pipe(encoder);

      stream.on('end', () => {
        rimraf(pattern, (err) => {
          if (err) {
            winston.error(err, 'Could not delete files', id);
          }
        });
      });

      res.writeHead(200, { "Content-Type": "image/gif" });
      stream.pipe(res);
    })
    .catch((err) => {
      winston.error(err);
      res.status(500).send();
    });
});

app.listen(3000);
