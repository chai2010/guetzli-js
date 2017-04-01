// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const ccapi = function() {
	try {
		return require('../build/Release/guetzli.node');
	} catch(err) {
		return require('../build/Debug/guetzli.node');
	}
}()

const assert = require('assert')
const utils = require('./utils')

export const version: string = ccapi.getVersion()

export const minQuality: number = 84
export const maxQuality: number = 110
export const defaultQuality: number = 95

export interface Image {
	width:    number;
	height:   number;
	channels: number;
	depth:    number;
	stride:   number;
	pix:      Uint8Array;
}

export function encodeImage(m: Image, quality:number = defaultQuality): Uint8Array {
	if(m.depth != 8) {
		throw "guetzli.encodeImage: unsupport depth: " + m.depth
	}
	if(m.channels != 1 && m.channels != 3 && m.channels != 4) {
		throw "guetzli.encodeImage: unsupport channels:" + m.channels
	}
	return ccapi.encodeImage(m.pix, m.width, m.height, m.channels, m.stride, quality)
}

export function encodeGray(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 1,
		depth:    8,
		stride:   stride,
		pix:      pix,
	})
}
export function encodeRGB(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 3,
		depth:    8,
		stride:   stride,
		pix:      pix,
	})
}
export function encodeRGBA(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 4,
		depth:    8,
		stride:   stride,
		pix:      pix,
	})
}

export function decodePng24(data:Uint8Array): Image {
	assert(utils.isBuffer(data))
	assert(data.length > 0)

	var m = ccapi.decodePng24(data)

	assert(utils.isBuffer(m.pix))
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)

	return {
		width: m.width,
		height: m.height,
		channels: m.channels,
		depth: m.depth,
		stride: m.width*3,
		pix: m.pix,
	}
}
export function decodePng32(data:Uint8Array): Image {
	assert(utils.isBuffer(data))
	assert(data.length > 0)

	var m = ccapi.decodePng32(data)

	assert(utils.isBuffer(m.pix))
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)

	return {
		width: m.width,
		height: m.height,
		channels: m.channels,
		depth: m.depth,
		stride: m.width*4,
		pix: m.pix,
	}
}

if(require.main === module) {
	main(process.argv.splice(2))
}

function main(args: string[]) {
	if(args.length == 1 && args[0] == '-v') {
		console.log('guetzli-' + ccapi.getVersion())
		process.exit(0)
	}
}

