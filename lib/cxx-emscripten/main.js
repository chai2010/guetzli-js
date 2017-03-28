// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Module = require('./guetzli.out')

// CAPI_EXPORT(const char*) guetzliGetVersion();
var guetzliGetVersion = Module.cwrap(
	'guetzliGetVersion', 'string', []
)

// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
var guetzli_string_new = Module.cwrap(
	'guetzli_string_new', 'number', [
		'number' // size
	]
)

// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
var guetzli_string_delete = Module.cwrap(
	'guetzli_string_delete', 'null', [
		'number' // p
	]
)

// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
var guetzli_string_resize = Module.cwrap(
	'guetzli_string_resize', 'null', [
		'number', // p
		'number'  // size
	]
)

// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
var guetzli_string_size = Module.cwrap(
	'guetzli_string_size', 'number', [
		'number' // p
	]
)

// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
var guetzli_string_data = Module.cwrap(
	'guetzli_string_data', 'number', [
		'number' // p
	]
)

// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
var guetzli_encode_Gray = Module.cwrap(
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
var guetzli_encode_RGB = Module.cwrap(
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
var guetzli_encode_RGBA = Module.cwrap(
	'guetzli_encode_RGBA', 'number', [
		'array',  // pix
		'number', // width
		'number', // height
		'number', // stride
		'number'  // quality
	]
)

exports.version = guetzliGetVersion()

exports.encodeGray = function(pix, w, h, stride, quality) {
	var s = guetzli_encode_Gray(pix, w, h, stride, quality)
	var start = guetzli_string_data(s)
	var end = start + guetzli_string_size(s)
	var q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

exports.encodeRGB  = function(pix, w, h, stride, quality) {
	var s = guetzli_encode_RGB(pix, w, h, stride, quality)
	var start = guetzli_string_data(s)
	var end = start + guetzli_string_size(s)
	var q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

exports.encodeRGBA = function(pix, w, h, stride, quality) {
	var s = guetzli_encode_RGBA(pix, w, h, stride, quality)
	var start = guetzli_string_data(s)
	var end = start + guetzli_string_size(s)
	var q = Module.HEAPU8.slice(start, end)
	guetzli_string_delete(s)
	return q
}

if(require.main === module) {
	console.log('guetzli-', guetzliGetVersion())
}
