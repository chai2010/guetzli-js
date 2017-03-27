// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import * as greet from "./greet"

export function hi(name: string) {
	return greet.sayHello(name)
}

export function showHello(id: string, name: string): void {
	const e = document.getElementById(id)
	e.innerText = greet.sayHello(name)
}

var ccapi = function() {
	try {
		return require('../build/Release/guetzli.node');
	} catch(err) {
		return require('../build/Debug/guetzli.node');
	}
}()

var assert = require('assert');
var utils = require('./utils.js')

exports.version = ccapi.getVersion()

exports.minQuality = 84
exports.maxQuality = 110
exports.defaultQuality = 95

// function(buffer, width, height, stride, quality) -> Buffer
exports.encodeGray = function(pix_buffer:any, width:number, height:number, stride:number, quality:number) {
	assert(utils.isBuffer(pix_buffer))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*1)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeGray(pix_buffer, width, height, stride, quality)
}
exports.encodeRGB = function(pix_buffer:any, width:number, height:number, stride:number, quality:number) {
	assert(utils.isBuffer(pix_buffer))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*3)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeRGB(pix_buffer, width, height, stride, quality)
}
exports.encodeRGBA = function(pix_buffer:any, width:number, height:number, stride:number, quality:number) {
	assert(utils.isBuffer(pix_buffer))
	assert((width|0) > 0 && (height|0) > 0)
	assert((stride|0) == 0 || (stride|0) >= (width|0)*4)
	assert((quality|0) >= this.minQuality && (quality|0) <= this.maxQuality)

	return ccapi.encodeRGBA(pix_buffer, width, height, stride, quality)
}

// function(data) -> {pix, width, height, channels, depth}
exports.decodePng24 = function(data_buffer:any) {
	assert(utils.isBuffer(data_buffer))
	assert(data_buffer.length > 0)

	var m = ccapi.decodePng24(data_buffer)

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
exports.decodePng32 = function(data_buffer:any) {
	assert(utils.isBuffer(data_buffer))
	assert(data_buffer.length > 0)

	var m = ccapi.decodePng32(data_buffer)

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

