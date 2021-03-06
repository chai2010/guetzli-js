<p align="center"><img src="https://raw.githubusercontent.com/chai2010/guetzli-js/master/guetzli.png" alt="Guetzli" width="64"></p>

----

- *赞助 BTC: 1Cbd6oGAUUyBi7X7MaR4np4nTmQZXVgkCW*
- *赞助 ETH: 0x623A3C3a72186A6336C79b18Ac1eD36e1c71A8a6*
- *Go语言付费QQ群: 1055927514*

----

# guetzli-js

[![Build Status](https://travis-ci.org/chai2010/guetzli-js.svg)](https://travis-ci.org/chai2010/guetzli-js) [![NPM](https://img.shields.io/npm/dt/guetzli-js.svg)](https://www.npmjs.com/package/guetzli-js) [![NPM Version](https://img.shields.io/npm/v/guetzli-js.svg)](https://www.npmjs.com/package/guetzli-js) ![License](https://img.shields.io/npm/l/guetzli-js.svg)

[![NPM](https://nodei.co/npm/guetzli-js.png?downloads=true&downloadRank=true&stars=true)](https://npmjs.org/guetzli-js)
[![NPM](https://nodei.co/npm-dl/guetzli-js.png?height=3&months=9)](https://npmjs.org/guetzli-js)


> [Guetzli](https://github.com/google/guetzli) is a JPEG encoder that aims for excellent compression density at high visual quality. Guetzli-generated images are typically 20-30% smaller than images of equivalent quality generated by libjpeg.

[Guetzli](https://github.com/google/guetzli) for NodeJS/Browser

## Demo

This demo show guetzli-js in browser, encode a canvas and save as a jpeg file.

- https://chai2010.github.io/guetzli-js/example/hello-01


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


## Command: `guetzli-cli`

```
$ guetzli-cli bees.png bees.jpg
Done

$ guetzli-cli -h
Usage: guetzli input_filename output_filename

$ guetzli-cli -v
guetzli-1.0.1
```


## Guetzli API

### Image Type:

```ts
// const image = require('guetzli-js/dist/lib/image')

interface image.Image {
	width:    number;
	height:   number;
	channels: number; // Gray=1, RGB=3, RGBA=4
	stride?:  number; // 0 or >= width*channels
	pix:      Uint8Array;
}
```

### Guetzli API:

```ts
// const guetzli = require('guetzli-js')
// const guetzli_asmjs = require('guetzli-js/dist/lib/cxx-emscripten/guetzli.out')

const version: string;        // google/guetzli version
const minQuality: number;     // 84
const maxQuality: number;     // 110
const defaultQuality: number; // 95

function encodeImage(
	m: image.Image, quality?: number = defaultQuality
): Uint8Array;

function encodeGray(
	pix: Uint8Array, width: number, height: number,
	stride?: number = 0, quality?: number = defaultQuality
): Uint8Array;

function encodeRGB(
	pix: Uint8Array, width: number, height: number,
	stride?: number = 0, quality?: number = defaultQuality
): Uint8Array;

function encodeRGBA(
	pix: Uint8Array, width: number, height: number,
	stride?: number = 0, quality?: number = defaultQuality
): Uint8Array;
```

### Helpers (NodeJS Only):


```ts
// const helper = require('guetzli-js/dist/lib/helper')

function decodePng(data: Uint8Array, expect_channels?: number = 4): image.Image;
function decodeJpg(data: Uint8Array, expect_channels?: number = 3): image.Image;

function encodePng(
	pix: Uint8Array, width: number, height: number,
	channels: number, stride?: number = 0
): Uint8Array;

function encodeJpg(
	pix: Uint8Array, width: number, height: number,
	channels: number, stride?: number = 0,
	quality?: number = 95
): Uint8Array;

// only for jpg/png format
function loadImage(filename: string): image.Image;
```

## Examples

### NodeJS

```js
const fs = require('fs')
const guetzli = require('guetzli-js')
const helper = require('guetzli-js/dist/lib/helper')

// load png
let data = fs.readFileSync('bees.png')

// decode png image
let m = helper.decodePng(data, 4)

// encode jpg image
let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality)

// save jpg
fs.writeFileSync('bees.jpg', jpegData)
```

### Borwser

```html
<!DOCTYPE html>

<head>
<title>Hello</title>

<script src="./jquery.min.js"></script>
<script src='./dist/lib/cxx-emscripten/guetzli.out.js'></script>
</head>

<body>
<canvas id="myCanvas" width="120" height="80">show image</canvas>
<div><button id="saveAsBtnRun">Save As...</button></div>

<script>
const guetzli = Module

$(document).ready(function() {
	let canvas = document.getElementById('myCanvas')
	let ctx = canvas.getContext('2d')

	let m = new Image()
	m.src = './testdata/bees.png'
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
		stride:   canvas.width*4,
		pix:      imgd.data,
	})
})
</script>
</body>
```

See https://chai2010.github.io/guetzli-js/example/hello-01/

### Borwser: Settings

```html
<script>
var Module = {}
Module.TOTAL_STACK = 5*1024*1024;   // 5 MB
Module.TOTAL_MEMORY = 64*1024*1024; // 64 MB
Module.ALLOW_MEMORY_GROWTH = true;
Module.SIMD = false;
</script>

<script src='./dist/lib/cxx-emscripten/guetzli.out.js'></script>
```

### RGB <==> Gray

```js
function gray2rgb(gray, width, height, stride) {
	if(stride == 0) { stride = width }

	let rgb = new Uint8Array(width*height*3)
	let off = 0

	for(let y = 0; y < height; y++) {
		for(let x = 0; x < width; x++) {
			let V = gray[y*stride + x]

			rgb[off++] = V // R
			rgb[off++] = V // G
			rgb[off++] = V // B
		}
	}
	return rgb
}

function rgb2gray(rgb, width, height, stride) {
	if(stride == 0) { stride = width*3 }

	let gray = new Uint8Array(width*height)
	let off = 0

	for(let y = 0; y < height; y++) {
		for(let x = 0; x < width; x++) {
			let idx = y*stride + x*3
			let R = rgb[idx+0]
			let G = rgb[idx+1]
			let B = rgb[idx+2]

			gray[off++] = ((R+G+B)/3)|0
		}
	}
	return gray
}
```

## Other

### Benchmark

```
$ gulp bench
[09:12:33] Running suite Guetzli [D:\work\guetzli-js\dist\lib\bench.js]...
[09:12:52]    encodeImage.bees-small.rgb x 0.63 ops/sec ±0.81% (6 runs sampled)
[09:13:22]    encodeImage.asm.bees-small.rgb x 0.35 ops/sec ±2.18% (5 runs sampled)
[09:13:27]    helper.encodeJpg.bees-small.rgb x 1,464 ops/sec ±0.79% (94 runs sampled)
[09:13:33]    helper.encodePng.bees-small.rgb x 173 ops/sec ±1.32% (82 runs sampled)
[09:13:33] Fastest test is helper.encodeJpg.bees-small.rgb at 8.5x faster than helper.encodePng.bees-small.rgb
```

### Unit Test

```
$ npm test
> guetzli-js@1.0.8 test D:\work\guetzli-js
> nodeunit dist/lib/test.js

test.js
√ testVersion
√ testIsPngFilename
√ testIsJpegFilename
√ testLoadImage_png
√ testLoadImage_jpeg
√ testGuetzliEncode

OK: 21 assertions (12483ms)
```


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


### NPM mirror for China

- https://npm.taobao.org/
- `npm install -g cnpm --registry=https://registry.npm.taobao.org`
- `cnpm install -g windows-build-tool` (Windows)
- `cnpm install -g node-gyp`
- `cnpm install -g guetzli-js`


## License

MIT © [chai2010](https://github.com/chai2010)
