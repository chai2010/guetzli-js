// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var Module = require("./cxx-emscripten/guetzli.out");
function cToUint8Array(p, size) {
    var q = new Uint8Array(size | 0);
    for (var i = 0; i < q.length; i++) {
        q[i] = Module.HEAPU8[p + i];
    }
    return q;
}
// CAPI_EXPORT(const char*) guetzliGetVersion();
function guetzliGetVersion() {
    return Module.ccall('guetzliGetVersion', 'string', [], []);
}
// CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
function guetzli_string_new(size) {
    return Module.ccall('guetzli_string_new', 'number', ['number'], [size]);
}
// CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);
function guetzli_string_delete(p) {
    Module.ccall('guetzli_string_delete', 'null', ['number'], [p]);
}
// CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
function guetzli_string_resize(p, size) {
    return Module.ccall('guetzli_string_resize', 'null', ['number', 'number'], [p, size]);
}
// CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
function guetzli_string_size(p) {
    return Module.ccall('guetzli_string_size', 'number', ['number'], [p]);
}
// CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);
function guetzli_string_data(p) {
    return Module.ccall('guetzli_string_data', 'number', ['number'], [p]);
}
// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_Gray(pix, w, h, stride, quality) {
    return Module.ccall('guetzli_encode_Gray', 'number', ['array', 'number', 'number', 'number', 'number'], [pix, w, h, stride, quality]);
}
// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGB(pix, w, h, stride, quality) {
    return Module.ccall('guetzli_encode_RGB', 'number', ['array', 'number', 'number', 'number', 'number'], [pix, w, h, stride, quality]);
}
// CAPI_EXPORT(guetzli_string_t*)
// guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality);
function guetzli_encode_RGBA(pix, w, h, stride, quality) {
    return Module.ccall('guetzli_encode_RGBA', 'number', ['array', 'number', 'number', 'number', 'number'], [pix, w, h, stride, quality]);
}
exports.version = guetzliGetVersion();
exports.minQuality = 84;
exports.maxQuality = 110;
exports.defaultQuality = 95;
function encodeImage(m, quality) {
    if (quality === void 0) { quality = exports.defaultQuality; }
    switch (m.channels) {
        case 1: return encodeGray(m.pix, m.width, m.height, m.stride, quality);
        case 3: return encodeRGB(m.pix, m.width, m.height, m.stride, quality);
        case 4: return encodeRGBA(m.pix, m.width, m.height, m.stride, quality);
    }
    throw "guetzli.encodeImage: unknown channels:" + m.channels;
}
exports.encodeImage = encodeImage;
function encodeGray(pix, w, h, stride, quality) {
    var s = guetzli_encode_Gray(pix, w, h, stride, quality);
    var q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s));
    guetzli_string_delete(s);
    return q;
}
exports.encodeGray = encodeGray;
function encodeRGB(pix, w, h, stride, quality) {
    var s = guetzli_encode_RGB(pix, w, h, stride, quality);
    var q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s));
    guetzli_string_delete(s);
    return q;
}
exports.encodeRGB = encodeRGB;
function encodeRGBA(pix, w, h, stride, quality) {
    var s = guetzli_encode_RGBA(pix, w, h, stride, quality);
    var q = cToUint8Array(guetzli_string_data(s), guetzli_string_size(s));
    guetzli_string_delete(s);
    return q;
}
exports.encodeRGBA = encodeRGBA;
if (require.main === module) {
    console.log('guetzli-', guetzliGetVersion());
}
