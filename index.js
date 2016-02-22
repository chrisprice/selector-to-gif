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
    res.status(400)
      .send(`Parameter ${errors[0].param} not specified or invalid`)
    return;
  }

  const id = uuid();

  phantom(Object.assign({}, req.query, {
      pattern: path.join('frames', `frame-${id}-$i.png`)
    }), process.env.TIMEOUT)
    .then((bBox) => {
      var encoder = new GIFEncoder(bBox.width, bBox.height)
        .createWriteStream({
          repeat: req.query.repeat,
          delay: req.query.interval,
          quality: 10
        });

      res.writeHead(200, { "Content-Type": "image/gif" });

      const stream = pngFileStream(path.join(workingDirectory, `frame-${id}-*.png`));

      stream.pipe(encoder)
        .pipe(res);

      stream.on('end', () => {
        rimraf(path.join(workingDirectory, `frame-${id}-*.png`), (err) => {
          if (err) {
            winston.error(err, 'Could not delete files', id);
          }
        });
      });
    });
});

app.listen(3000);
