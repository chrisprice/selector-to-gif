# selector-to-gif
HTTP service to convert URL + selector to animated GIF

## API

`url` - The URL containing the element to capture e.g. `https://t.d3fc.io/status/700046974305857536`
`selector` - The CSS selector of the element on the page e.g. `iframe`
`fps` - The number of frames to capture per second e.g. `1`
`duration` - The number of seconds to capture e.g. `10`
`viewport` - The size of the viewport to use when capturing e.g. `1024*768`
