// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import Module = require('./cxx-emscripten/guetzli.out')

// CAPI_EXPORT(const char*) guetzliGetVersion();
const guetzliGetVersion = Module.cwrap(
	'guetzliGetVersion', 'string', []
)

// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
const guetzli_string_new = Module.cwrap(
	'guetzli_string_new', 'number', [
		'number' // size
	]
)

// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
const guetzli_string_delete = Module.cwrap(
	'guetzli_string_delete', 'null', [
		'number' // p
	]
)

// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
const guetzli_string_resize = Module.cwrap(
	'guetzli_string_resize', 'null', [
		'number', // p
		'number'  // size
	]
)

// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
const guetzli_string_size = Module.cwrap(
	'guetzli_string_size', 'number', [
		'number' // p
	]
)

// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
const guetzli_string_data = Module.cwrap(
	'guetzli_string_data', 'number', [
		'number' // p
	]
)

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
const guetzli_encode_Gray = Module.cwrap(
	'guetzli_encode_Gray', 'number', [
		'array',  // pix
		'number', // width
		'number', // height
		'number', // stride
		'number'  // quality
	]
)

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality);
const guetzli_encode_RGB = Module.cwrap(
	'guetzli_encode_RGB', 'number', [
		'array',  // pix
		'number', // width
		'number', // height
		'number', // stride
		'number'  // quality
	]
)

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality);
const guetzli_encode_RGBA = Module.cwrap(
	'guetzli_encode_RGBA', 'number', [
		'array',  // pix
		'number', // width
		'number', // height
		'number', // stride
		'number'  // quality
	]
)

export const version: string = guetzliGetVersion()

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
