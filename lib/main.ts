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
	pix:      Uint8Array;
	width:    number;
	height:   number;
	channels: number;
	depth:    number;
}

export function encodeGray(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	assert(utils.isBuffer(pix))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*1)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeGray(pix, width, height, stride, quality)
}
export function encodeRGB(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	assert(utils.isBuffer(pix))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*3)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeRGB(pix, width, height, stride, quality)
}
export function encodeRGBA(pix:Uint8Array, width:number, height:number, stride:number, quality:number): Uint8Array {
	assert(utils.isBuffer(pix))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*4)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeRGBA(pix, width, height, stride, quality)
}

export function decodePng24(data:Uint8Array): Image {
	assert(utils.isBuffer(data))
	assert(data.length > 0)

	var m = ccapi.decodePng24(data)

	assert(utils.isBuffer(m.pix))
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)

	return {
		pix: m.pix,
		width: m.width,
		height: m.height,
		channels: m.channels,
		depth: m.depth
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
		pix: m.pix,
		width: m.width,
		height: m.height,
		channels: m.channels,
		depth: m.depth
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

