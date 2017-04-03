// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import * as assert from 'assert'
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

export function decodePng24(data:Uint8Array): image.Image {
	let m = ccapi.decodePng(data, 3)

	assert(m.pix.length > 0)
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)
	assert(m.channels == 3)
	assert(m.depth == 8)

	return {
		width: m.width,
		height: m.height,
		channels: m.channels,
		stride: m.width*3,
		pix: m.pix,
	}
}
export function decodePng32(data:Uint8Array): image.Image {
	let m = ccapi.decodePng(data, 4)

	assert(m.pix.length > 0)
	assert(m.width > 0 && m.height > 0)
	assert(m.channels > 0 && m.depth > 0)
	assert(m.channels == 4)
	assert(m.depth == 8)
	return {
		width: m.width,
		height: m.height,
		channels: m.channels,
		stride: m.width*4,
		pix: m.pix,
	}
}

export function encodePng24(pix:Uint8Array, width:number, height:number, stride:number): Uint8Array {
	return ccapi.encodePng(pix, width, height, 3, stride)
}
export function encodePng32(pix:Uint8Array, width:number, height:number, stride:number): Uint8Array {
	return ccapi.encodePng(pix, width, height, 4, stride)
}

// ----------------------------------------------------------------------------
// JPEG helper (NodeJS Only)
// ----------------------------------------------------------------------------

export function encodeJpg(pix:Uint8Array, width:number, height:number, channels: number, stride:number, quality: number): Uint8Array {
	return ccapi.encodeJpg(pix, width, height, channels, stride, quality)
}

export function decodeJpg(data:Uint8Array, expect_channels: number = 3): image.Image {
	return ccapi.decodeJpg(data, expect_channels)
}
