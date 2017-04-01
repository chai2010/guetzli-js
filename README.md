<p align="center"><img src="guetzli.png" alt="Guetzli" width="64"></p>

# guetzli-js

[![Build Status](https://travis-ci.org/chai2010/guetzli-js.svg)](https://travis-ci.org/chai2010/guetzli-js)
[![NPM](https://img.shields.io/npm/dt/guetzli-js.svg)](https://www.npmjs.com/package/guetzli-js)
[![NPM Version](https://img.shields.io/npm/v/guetzli-js.svg)](https://www.npmjs.com/package/guetzli-js)
![License](https://img.shields.io/npm/l/guetzli-js.svg)

[![NPM](https://nodei.co/npm/guetzli-js.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/guetzli-js)  
[![NPM](https://nodei.co/npm-dl/guetzli-js.png?height=3&months=9)](https://npmjs.org/guetzli-js)  


> [Guetzli](https://github.com/google/guetzli) is a JPEG encoder that aims for excellent compression density at high visual quality. Guetzli-generated images are typically 20-30% smaller than images of equivalent quality generated by libjpeg.

[Guetzli](https://github.com/google/guetzli) for NodeJS/Browser

## Demo

This demo show guetzli-js in browser, encode a canvas and save as a jpeg file.

- https://chai2010.github.io/guetzli-js/example/
- https://github.com/chai2010/guetzli-js/tree/master/example


**Browser suggest: Chrome, Firefox, Edge. Chrome is the best choice!**


## Install

### Windows

```
$ npm install -g windows-build-tool
$ npm install -g node-gyp

$ node-gyp install
$ npm install -g guetzli-js
```

### macOS and Linux

```
$ npm install -g node-gyp

$ node-gyp install
$ npm install -g guetzli-js
```

### NPM mirror for China

- https://npm.taobao.org/
- `npm install -g cnpm --registry=https://registry.npm.taobao.org`
- `cnpm install -g windows-build-tool` (Windows)
- `cnpm install -g node-gyp`
- `cnpm install -g guetzli-js`


## Command: `guetzli-cli`

```
$ guetzli-cli bees.png bees.jpg
Done

$ guetzli-cli -h
Usage: guetzli input_filename output_filename

$ guetzli-cli -v
guetzli-1.0.1
```

## Example

NodeJS:

```js
const fs = require('fs')
const guetzli = require('guetzli-js')

// load png
let data = fs.readFileSync('bees.png')

// decode png image
let m = guetzli.decodePng32(data)

// encode jpg image
let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality)

// save jpg
fs.writeFileSync('bees.jpg', jpegData)
```

Borwser(A), `<script src='./guetzli.out.js'></script>` style:

```html
<!DOCTYPE html>

<head>
<title>Hello</title>

<script src="./jquery.min.js"></script>
</head>

<body>
<canvas id="myCanvas" width="120" height="80">show image</canvas>
<div><button id="saveAsBtnRun">Save As...</button></div>

<script src='./guetzli.out.js'></script>
<script>
const guetzli = Module

$(document).ready(function() {
	let canvas = document.getElementById('myCanvas')
	let ctx = canvas.getContext('2d')

	let m = new Image()
	m.src = './bees.png'
	m.onload = function() {
		ctx.drawImage(m, 0, 0, canvas.width, canvas.height)
	}
})
$("#saveAsBtnRun").click(function() {
	let canvas = document.getElementById('myCanvas')
	let ctx = canvas.getContext('2d')
	let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height)

	let jpegData = guetzli.encodeImage({
		width:    canvas.width,
		height:   canvas.height,
		channels: 4,
		depth:    8,
		stride:   0,
		pix:      imgd.data,
	})
})
</script>
</body>
```

Borwser(B), `require('guetzli-js/dist/lib/browser')` style:

```js
const guetzli = require('guetzli-js/dist/lib/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height)

// all image
let jpegData = guetzli.encodeImage({
	width:    canvas.width,
	height:   canvas.height,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      imgd.data,
})

// sub image
let jpegData2 = guetzli.encodeImage({
	width:    canvas.width/2,
	height:   canvas.height/2,
	channels: 4,
	depth:    8,
	stride:   canvas.width*4, // avoid padding
	pix:      imgd.data,
})
```

## Guetzli API

### Const

```ts
export declare const version: string;        // 1.0.1, google/guetzli version
export declare const minQuality: number;     // 84
export declare const maxQuality: number;     // 110
export declare const defaultQuality: number; // 95
```

### Image Type

```ts
interface Image {
    width:    number;
    height:   number;
    channels: number;
    depth:    number;
    stride:   number;
    pix:      Uint8Array;
}
```

### `encodeImage(m: Image, quality?: number = defaultQuality): Uint8Array`

```js
const guetzli = require('guetzli-js')

let w = 300
let h = 200
let pix = new Uint8Array(w*h*4) // RGBA

let jpegData = guetzli.encodeImage({
	width:    w,
	height:   h,
	channels: 4,
	depth:    8,
	stride:   0,
	pix:      pix,
})
```

### `encodeGray(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`

```js
const guetzli = require('guetzli-js/dist/lib/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

let off = 0
let gray = new Uint8Array(w*h)

// GRBA => Gray
for(let y = 0; y < canvas.height; y++) {
	for(let x = 0; x < canvas.width; x++) {
		let idx = y*canvas.width+x
		let R = rgba[idx*4+0]
		let G = rgba[idx*4+0]
		let B = rgba[idx*4+0]

		gray[off++] = ((R+G+B)/3)|0
	}
}

// encode as Gray
let jpegData = guetzli.encodeGray(
	gray, canvas.width, canvas.height, 0,
	guetzli.defaultQuality
)
```

### `encodeRGB(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`

```js
const guetzli = require('guetzli-js/dist/lib/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

let off = 0
let rgb = new Uint8Array(w*h*3)

// GRBA => RGB
for(let y = 0; y < canvas.height; y++) {
	for(let x = 0; x < canvas.width; x++) {
		let idx = y*canvas.width+x
		rgb[off++] = rgba[idx*4+0]
		rgb[off++] = rgba[idx*4+0]
		rgb[off++] = rgba[idx*4+0]
	}
}

// encode as RGB
let jpegData = guetzli.encodeRGB(
	rgb, canvas.width, canvas.height, 0,
	guetzli.defaultQuality
)
```

### `encodeRGBA(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array`

```js
const guetzli = require('guetzli-js/dist/lib/browser')

let canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data

// encode as RGBA
let jpegData = guetzli.encodeRGBA(
	rgba, canvas.width, canvas.height, 0,
	guetzli.defaultQuality
)
```

## PNG helper (only for NodeJS)

### `decodePng24(data: Uint8Array): Image`

```js
const fs = require('fs')
const assert = require('assert')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng24(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 3) // RGB
assert(m.depth == 8)    // 3*8 = 24 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

### `decodePng32(data: Uint8Array): Image`

```js
const fs = require('fs')
const assert = require('assert')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng32(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 4) // RGBA
assert(m.depth == 8)    // 4*8 = 32 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

## Other

### Build `guetzli.node` with CMake

**Windows x64**

- Install CMake 3.5+
- Install VS2015
- run `build-win64.bat` in command line

**Windows x86**

- Install CMake 3.5+
- Install VS2015
- run `build-win32.bat` in command line

**Darwin or Linux**

- Install CMake 3.5+
- Install GCC
- `mkdir build`
- `cd build && cmake .. && make install`

### Build `lib/cxx-emscripten/guetzli.out.js` with Emscripten

- Install Emscripten
- `make`


## License

MIT © [chai2010](https://github.com/chai2010)
