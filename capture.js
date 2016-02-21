"use strict";

var url = 'https://t.d3fc.io/status/700046974305857536',
  viewport = '1024,768'.split(',');

var page = require('webpage').create();
page.viewportSize = { width: viewport[0], height : viewport[1] };
page.open(url, function(status) {
  if (status === 'success') {
    var bbox = page.evaluate(function() {
      var elem = document.querySelector('iframe');
      return elem && elem.getBoundingClientRect();
    });
    if (bbox) {
      page.clipRect = bbox;
      var frame = 0, frameCount = 10;
      setInterval(function() {
        if (frame === frameCount) {
          return phantom.exit();
        }
        page.render('frame-' + frame + '.png');
        frame++;
      }, 16);
    }
  }
})
// // page.evaluate(function() {
// // });
