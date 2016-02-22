"use strict";

var zpad = require('zpad');
var args = require('system').args;
var page = require('webpage').create();

if (args.length !== 2) {
  console.error('Not enough arguments');
  phantom.exit(1);
}

var options = JSON.parse(args[1]);

function getBBox(selector) {
  var elem = document.querySelector(selector);
  return elem && elem.getBoundingClientRect();
}

function filename(index) {
  var chars = Math.ceil(Math.log(options.count) / Math.LN10);
  var padded = zpad(index, chars);
  return options.pattern.replace('$i', padded);
}

function pageLoaded(status) {
  if (status !== 'success') {
    console.error('URL failed to load');
    return phantom.exit(1);
  }
  var bbox = page.evaluate(getBBox, options.selector);
  if (!bbox) {
    console.error('Element not found');
    return phantom.exit(1);
  }
  if (bbox.width * bbox.height > options.maxArea) {
    console.error('BBox too large');
    return phantom.exit(1);
  }
  console.log(JSON.stringify(bbox));
  page.clipRect = bbox;
  var frame = 0;
  setInterval(function() {
    if (frame >= options.count) {
      return phantom.exit();
    }
    page.render(filename(frame));
    frame++;
  }, options.interval);
}

page.viewportSize = {
  width: options.viewport[0],
  height : options.viewport[1]
};
page.open(options.url, pageLoaded);
