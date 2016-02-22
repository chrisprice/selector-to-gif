"use strict";

var zpad = require('zpad');
var args = require('system').args;
var page = require('webpage').create();

if (args.length !== 3) {
  console.error('Not enough arguments');
  phantom.exit(1);
}

var pattern = args[1];
var options = JSON.parse(args[2]);

function getBBox(selector) {
  var elem = document.querySelector(selector);
  return elem && elem.getBoundingClientRect();
}

function filename(index) {
  var chars = Math.ceil(Math.log(options.count) / Math.LN10);
  var padded = zpad(index, chars);
  return pattern.replace('*', padded);
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
  if (bbox.width > options.width || bbox.height > options.height) {
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
  width: options.width,
  height : options.height
};
page.open(options.url, pageLoaded);
