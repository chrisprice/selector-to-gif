# selector-to-gif
HTTP service to convert URL + selector to animated GIF

*WARNING - This service is not intended to be exposed directly to the internet.*

Amongst the many reasons this would be a bad idea -
* there's no upper limits on the API parameters
* there's no throttling of requests

## API

The following parameters are all required -

* `url` - The URL containing the element to capture e.g. `https://t.d3fc.io/status/700046974305857536`
* `selector` - The CSS selector of the element on the page e.g. `iframe`
* `delay` - The delay before the first frame capture e.g. `1000`
* `interval` - The interval between frame capture e.g. `16`
* `count` - The number of frames to capture e.g. `10`
* `width` - The width of the viewport to use when capturing e.g. `1024`
* `height` - The height of the viewport to use when capturing e.g. `768`
* `repeat` - The loop count to use for the resulting GIF e.g. `0` (infinite)

## Environment variables

The following environment variables can be configured -

* `TIMEOUT` - Enforce a maximum time limit on the capture process. By default
there is no timeout.
