// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import * as assert from 'assert'
import * as fs from 'fs'

import * as image from './image'

const ccapi = function() {
	try {
		return require('../build/Release/guetzli.node');
	} catch(err) {
		return require('../build/Debug/guetzli.node');
	}
}()

export function isNode(): boolean {
	if(typeof process === 'object') {
		if(typeof process.versions === 'object') {
			if(typeof process.versions.node !== 'undefined') {
				return true
			}
		}
	}
	return false
}

export const is_node: boolean = isNode()

export function isUint8Array(obj:any): boolean {
	return obj instanceof Uint8Array && (!is_node || !Buffer.isBuffer(obj))
}

export function isArrayBuffer(obj:any): boolean {
	return obj instanceof ArrayBuffer
}

export function isBuffer(obj:any): boolean {
	if(!is_node) {
		return false
	}
	return Buffer.isBuffer(obj)
}


// ----------------------------------------------------------------------------
// PNG helper (NodeJS Only)
// ----------------------------------------------------------------------------

export function decodePng(data:Uint8Array, expect_channels: number = 4): image.Image {
	assert(data && data.length > 0)
	assert(expect_channels == 1 || expect_channels == 3 || expect_channels == 4)

	let m = ccapi.decodePng(data, expect_channels)

	assert(m.pix && m.pix.length > 0)
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)
	assert(m.channels == expect_channels)

	return {
		width: m.width,
		height: m.height,
		channels: m.channels,
		stride: m.width*m.channels,
		pix: m.pix,
	}
}

export function encodePng(pix:Uint8Array, width:number, height:number, channels:number, stride:number = 0): Uint8Array {
	assert(pix && pix.length > 0)
	assert(width > 0)
	assert(height > 0)
	assert(channels == 1 || channels == 3 || channels == 4)
	assert(stride == 0 || stride >= width*channels)

	return ccapi.encodePng(pix, width, height, channels, stride)
}

// ----------------------------------------------------------------------------
// JPEG helper (NodeJS Only)
// ----------------------------------------------------------------------------

export function encodeJpg(pix:Uint8Array, width:number, height:number, channels: number, stride:number = 0, quality: number = 95): Uint8Array {
	assert(pix && pix.length > 0)
	assert(width > 0)
	assert(height > 0)
	assert(channels == 1 || channels == 3 || channels == 4)
	assert(stride == 0 || stride >= width*channels)

	return ccapi.encodeJpg(pix, width, height, channels, stride, quality)
}

export function decodeJpg(data:Uint8Array, expect_channels: number = 3): image.Image {
	assert(data && data.length > 0)
	assert(expect_channels == 1 || expect_channels == 3 || expect_channels == 4)

	return ccapi.decodeJpg(data, expect_channels)
}

// ----------------------------------------------------------------------------

export function loadImage(filename: string): image.Image {
	if(isPngFilename(filename)) {
		return loadPngImage(filename)
	}
	if(isJpegFilename(filename)) {
		return loadJpegImage(filename)
	}
	throw "unsupport format: " + filename
}

export function isPngFilename(filename: string): boolean {
	return /\.png/i.test(filename)
}

export function isJpegFilename(filename: string): boolean {
	return /\.jpg/i.test(filename) || /\.jpeg/i.test(filename)
}

export function loadPngImage(filename:string, expect_channels: number = 4): image.Image {
	let data = fs.readFileSync(filename)
	let m = decodePng(data, expect_channels)
	return m
}

export function loadJpegImage(filename:string, expect_channels: number = 3): image.Image {
	let data = fs.readFileSync(filename)
	let m = decodeJpg(data, expect_channels)
	return m
}

// ----------------------------------------------------------------------------
