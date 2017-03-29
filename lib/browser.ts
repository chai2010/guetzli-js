// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Module = require('./cxx-emscripten/guetzli.out')

// CAPI_EXPORT(const char*) guetzliGetVersion();
function guetzliGetVersion(): string {
	return Module.ccall('guetzliGetVersion', 'string',
		[],
		[]
	)
}

// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
function guetzli_string_new(size: number): number {
	return Module.ccall('guetzli_string_new', 'number',
		['number'],
		[size]
	)
}

// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
function guetzli_string_delete(p: number): void {
	Module.ccall('guetzli_string_delete', 'null',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
function guetzli_string_resize(p: number, size: number): void {
	return Module.ccall('guetzli_string_resize', 'null',
		['number', 'number'],
		[p, size]
	)
}

// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
function guetzli_string_size(p: number): number {
	return Module.ccall('guetzli_string_size', 'number',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
function guetzli_string_data(p: number): number {
	return Module.ccall('guetzli_string_data', 'number',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_Gray(pix: Uint8Array, w: number, h: number, stride: number, quality: number): number {
	return Module.ccall('guetzli_encode_Gray', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGB(pix: Uint8Array, w: number, h: number, stride: number, quality: number): number {
	return Module.ccall('guetzli_encode_RGB', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGBA(pix: Uint8Array, w: number, h: number, stride: number, quality: number): number {
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

export function encodeGray(pix:Uint8Array, w:number, h:number, stride:number, quality:number) {
	let s = guetzli_encode_Gray(pix, w, h, stride, quality)
	let start = guetzli_string_data(s)
	let end = start + guetzli_string_size(s)
	let q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

export function encodeRGB(pix:Uint8Array, w:number, h:number, stride:number, quality:number) {
	let s = guetzli_encode_RGB(pix, w, h, stride, quality)
	let start = guetzli_string_data(s)
	let end = start + guetzli_string_size(s)
	let q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

export function encodeRGBA(pix:Uint8Array, w:number, h:number, stride:number, quality:number) {
	let s = guetzli_encode_RGBA(pix, w, h, stride, quality)
	let start = guetzli_string_data(s)
	let end = start + guetzli_string_size(s)
	let q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

if(require.main === module) {
	console.log('guetzli-', guetzliGetVersion())
}
