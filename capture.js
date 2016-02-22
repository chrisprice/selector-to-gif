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
    if (frame >= options.frameCount) {
      return phantom.exit();
    }
    var filename = options.pattern.replace('$i', zpad(frame, 5));
    page.render(filename);
    frame++;
  }, options.frameInterval);
}

page.viewportSize = {
  width: options.viewport[0],
  height : options.viewport[1]
};
page.open(options.url, pageLoaded);
