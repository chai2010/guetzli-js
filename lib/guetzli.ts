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

// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------

export const version: string = ccapi.getVersion()

export const minQuality: number = 84
export const maxQuality: number = 110
export const defaultQuality: number = 95

export function encodeImage(m: image.Image, quality:number = defaultQuality): Uint8Array {
	if(m.channels != 1 && m.channels != 3 && m.channels != 4) {
		throw "guetzli.encodeImage: unsupport channels:" + m.channels
	}
	let stride = m.width*m.channels;
	if(m.stride && m.stride > 0) {
		stride = m.stride;
	}
	return ccapi.encodeImage(m.pix, m.width, m.height, m.channels, stride, quality)
}

export function encodeGray(pix:Uint8Array, width:number, height:number, stride:number = 0, quality:number = defaultQuality): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 1,
		stride:   stride,
		pix:      pix,
	})
}
export function encodeRGB(pix:Uint8Array, width:number, height:number, stride:number = 0, quality:number = defaultQuality): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 3,
		stride:   stride,
		pix:      pix,
	})
}
export function encodeRGBA(pix:Uint8Array, width:number, height:number, stride:number = 0, quality:number = defaultQuality): Uint8Array {
	return encodeImage({
		width:    width,
		height:   height,
		channels: 4,
		stride:   stride,
		pix:      pix,
	})
}

// ----------------------------------------------------------------------------
// main module
// ----------------------------------------------------------------------------

if(require.main === module) {
	main(process.argv.splice(2))
}

function main(args: string[]) {
	if(args.length == 1 && args[0] == '-v') {
		console.log('guetzli-' + ccapi.getVersion())
		process.exit(0)
	}
}

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------

