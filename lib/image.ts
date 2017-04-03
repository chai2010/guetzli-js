// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export interface Image {
	width:    number;
	height:   number;
	channels: number; // Gray=1, RGB=3, RGBA=4
	stride?:  number; // 0 or >= width*channels
	pix:      Uint8Array;
}

export function colorAt(m: Image, x: number, y: number, iChannel: number): number {
	if(iChannel >= m.channels) {
		return 0
	}

	let stride = m.width*m.channels;
	if(m.stride && m.stride > 0) {
		stride = m.stride;
	}
	
	let off = y*stride+x*m.channels+iChannel
	return m.pix[off]
}
