// Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// ----------------------------------------------------------------------------
// helper
// ----------------------------------------------------------------------------

// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
function guetzli_string_new(size) {
	return Module.ccall('guetzli_string_new', 'number',
		['number'],
		[size]
	)
}

// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
function guetzli_string_delete(p) {
	Module.ccall('guetzli_string_delete', 'null',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
function guetzli_string_resize(p, size) {
	return Module.ccall('guetzli_string_resize', 'null',
		['number', 'number'],
		[p, size]
	)
}

// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
function guetzli_string_size(p) {
	return Module.ccall('guetzli_string_size', 'number',
		['number'],
		[p]
	)
}

// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
function guetzli_string_data(p) {
	return Module.ccall('guetzli_string_data', 'number',
		['number'],
		[p]
	)
}

function guetzliGetVersion() {
	return Module.ccall('guetzliGetVersion', 'string',
		[],
		[]
	)
}

function guetzli_encode_Gray(pix, w, h, stride, quality) {
	return Module.ccall('guetzli_encode_Gray', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}
function guetzli_encode_RGB(pix, w, h, stride, quality) {
	return Module.ccall('guetzli_encode_RGB', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}
function guetzli_encode_RGBA(pix, w, h, stride, quality) {
	return Module.ccall('guetzli_encode_RGBA', 'number',
		['array', 'number', 'number', 'number', 'number'],
		[pix, w, h, stride, quality]
	)
}

function guetzli_cToUint8Array(p, size) {
	var q = new Uint8Array(size|0)
	for(var i = 0; i < q.length; i++) {
		q[i] = Module.HEAPU8[p+i]
	}
	return q
}

// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------

Module.version = guetzliGetVersion()

Module.minQuality = 84
Module.maxQuality = 110
Module.defaultQuality = 95

Module.encodeGray = function(pix, width, height, stride, quality) {
	var s = guetzli_encode_Gray(pix, width, height, stride, quality)
	var q = guetzli_cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}
Module.encodeRGB = function(pix, width, height, stride, quality) {
	var s = guetzli_encode_RGB(pix, width, height, stride, quality)
	var q = guetzli_cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}
Module.encodeRGBA = function(pix, width, height, stride, quality) {
	var s = guetzli_encode_RGBA(pix, width, height, stride, quality)
	var q = guetzli_cToUint8Array(guetzli_string_data(s), guetzli_string_size(s))
	guetzli_string_delete(s)
	return q
}
Module.encodeImage = function(m, quality) {
	if (quality === void 0) {
		quality = Module.defaultQuality
	}
	if(m.channels != 1 && m.channels != 3 && m.channels != 4) {
		throw "emscripten: encodeImage, invalid channels = " + (m.channels|0)
	}

	switch(m.channels) {
	case 1: return Module.encodeGray(m.pix, m.width, m.height, m.stride, quality)
	case 3: return Module.encodeRGB(m.pix, m.width, m.height, m.stride, quality)
	case 4: return Module.encodeRGBA(m.pix, m.width, m.height, m.stride, quality)
	}

	throw "unreachable!"
}

// ----------------------------------------------------------------------------
//  Module for browser
// ----------------------------------------------------------------------------

// browser: export Module
if(ENVIRONMENT_IS_WEB) {
	if(!window.module) {
		window.module = {}
	}
}
if(ENVIRONMENT_IS_WORKER) {
	if(!self.module) {
		self.module = {}
	}
}
if(ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	if(module['exports'] !== Module) {
		module['exports'] = Module
	}
}

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------

