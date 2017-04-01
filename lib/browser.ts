// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Module = require('./cxx-emscripten/guetzli.out')

function cToUint8Array(p: number, size: number): Uint8Array {
	let q = new Uint8Array(size|0)
	for(let i = 0; i < q.length; i++) {
		q[i] = Module.HEAPU8[p+i]
	}
	return q
}

// CAPI_EXPORT(const char*) guetzliGetVersion();
function guetzliGetVersion(): string {
	return Module.ccall('guetzliGetVersion', 'string',
		[],
		[]
	)
}

type guetzli_string_t = number

// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
function guetzli_string_new(size: number): guetzli_string_t {
	return Module.ccall('guetzli_string_new', 'number',
		['number'],
		[size]
	)
}

// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
function guetzli_string_delete(p: guetzli_string_t): void {
	Module.ccall('guetzli_string_delete', 'null',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
function guetzli_string_resize(p: guetzli_string_t, size: number): void {
	return Module.ccall('guetzli_string_resize', 'null',
		['number', 'number'],
		[p, size]
	)
}

// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
function guetzli_string_size(p: guetzli_string_t): number {
	return Module.ccall('guetzli_string_size', 'number',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
function guetzli_string_data(p: guetzli_string_t): number {
	return Module.ccall('guetzli_string_data', 'number',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_Gray(pix: Uint8Array, w: number, h: number, stride: number, quality: number): guetzli_string_t {
	return Module.ccall('guetzli_encode_Gray', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGB(pix: Uint8Array, w: number, h: number, stride: number, quality: number): guetzli_string_t {
	return Module.ccall('guetzli_encode_RGB', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGBA(pix: Uint8Array, w: number, h: number, stride: number, quality: number): guetzli_string_t {
	return Module.ccall('guetzli_encode_RGBA', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

export const version: string = guetzliGetVersion()

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
	switch(m.channels) {
	case 1: return encodeGray(m.pix, m.width, m.height, m.stride, quality)
	case 3: return encodeRGB(m.pix, m.width, m.height, m.stride, quality)
	case 4: return encodeRGBA(m.pix, m.width, m.height, m.stride, quality)
	}
	throw "guetzli.encodeImage: unknown channels:" + m.channels
}

export function encodeGray(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array {
	let s = guetzli_encode_Gray(pix, w, h, stride, quality)
	let q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}

export function encodeRGB(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array {
	let s = guetzli_encode_RGB(pix, w, h, stride, quality)
	let q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}

export function encodeRGBA(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array {
	let s = guetzli_encode_RGBA(pix, w, h, stride, quality)
	let q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}

if(require.main === module) {
	console.log('guetzli-', guetzliGetVersion())
}
