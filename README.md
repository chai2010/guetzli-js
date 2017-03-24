# guetzli-js

[Guetzli](https://github.com/google/g) for NodeJS/Browser


## Install

	$ npm install time

## Example

```js
const fs = require('fs')
const guetzli = require('guetzli')

// usage node a.js input.png output.jpg
let args = process.argv.splice(2)

// load png
let data = fs.readFileSync(args[0])

// decode png image
let m = guetzli.decodePng32(data)

// encode jpg image
let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality)

// save jpg
fs.writeFileSync(args[1], jpegData)
```

## API

TODO

