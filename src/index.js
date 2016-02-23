"use strict";

const winston = require('winston');
const os = require('os');
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

app.get('/', (req, res) => {
  const startAt = process.hrtime();

  req.checkQuery(schema);
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400)
      .send(`Parameter ${errors[0].param} not specified or invalid`);
  }

  const pattern = path.join(os.tmpdir(), `frame-${uuid()}-*.png`);

  phantom(req.query, pattern, process.env.TIMEOUT)
    .then((bBox) => {
      const encoder = new GIFEncoder(bBox.width, bBox.height)
        .createWriteStream({
          repeat: req.query.repeat,
          delay: req.query.interval
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
      res.error = err;
      res.status(500)
        .send(err.toString());
    })
    .then(() => {
      const diff = process.hrtime(startAt)
      const time = diff[0] * 1e3 + diff[1] * 1e-6
      winston.info({
        method: req.method,
        url: req.url,
        query: req.query,
        ip: req.ip,
        status: res.statusCode,
        duration: time.toFixed(1),
        error: res.error
      });
    });
});

app.listen(3000);
