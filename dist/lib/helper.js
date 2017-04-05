// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var assert = require("assert");
var fs = require("fs");
var ccapi = function () {
    try {
        return require('../build/Release/guetzli.node');
    }
    catch (err) {
        return require('../build/Debug/guetzli.node');
    }
}();
function isNode() {
    if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
            if (typeof process.versions.node !== 'undefined') {
                return true;
            }
        }
    }
    return false;
}
exports.isNode = isNode;
exports.is_node = isNode();
function isUint8Array(obj) {
    return obj instanceof Uint8Array && (!exports.is_node || !Buffer.isBuffer(obj));
}
exports.isUint8Array = isUint8Array;
function isArrayBuffer(obj) {
    return obj instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;
function isBuffer(obj) {
    if (!exports.is_node) {
        return false;
    }
    return Buffer.isBuffer(obj);
}
exports.isBuffer = isBuffer;
// ----------------------------------------------------------------------------
// PNG helper (NodeJS Only)
// ----------------------------------------------------------------------------
function decodePng(data, expect_channels) {
    if (expect_channels === void 0) { expect_channels = 4; }
    assert(data && data.length > 0);
    assert(expect_channels == 1 || expect_channels == 3 || expect_channels == 4);
    var m = ccapi.decodePng(data, expect_channels);
    assert(m.pix && m.pix.length > 0);
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
    assert(m.channels == expect_channels);
    return {
        width: m.width,
        height: m.height,
        channels: m.channels,
        stride: m.width * m.channels,
        pix: m.pix
    };
}
exports.decodePng = decodePng;
function encodePng(pix, width, height, channels, stride) {
    if (stride === void 0) { stride = 0; }
    assert(pix && pix.length > 0);
    assert(width > 0);
    assert(height > 0);
    assert(channels == 1 || channels == 3 || channels == 4);
    assert(stride == 0 || stride >= width * channels);
    return ccapi.encodePng(pix, width, height, channels, stride);
}
exports.encodePng = encodePng;
// ----------------------------------------------------------------------------
// JPEG helper (NodeJS Only)
// ----------------------------------------------------------------------------
function encodeJpg(pix, width, height, channels, stride, quality) {
    if (stride === void 0) { stride = 0; }
    if (quality === void 0) { quality = 95; }
    assert(pix && pix.length > 0);
    assert(width > 0);
    assert(height > 0);
    assert(channels == 1 || channels == 3 || channels == 4);
    assert(stride == 0 || stride >= width * channels);
    return ccapi.encodeJpg(pix, width, height, channels, stride, quality);
}
exports.encodeJpg = encodeJpg;
function decodeJpg(data, expect_channels) {
    if (expect_channels === void 0) { expect_channels = 3; }
    assert(data && data.length > 0);
    assert(expect_channels == 1 || expect_channels == 3 || expect_channels == 4);
    return ccapi.decodeJpg(data, expect_channels);
}
exports.decodeJpg = decodeJpg;
// ----------------------------------------------------------------------------
function loadImage(filename) {
    if (isPngFilename(filename)) {
        return loadPngImage(filename);
    }
    if (isJpegFilename(filename)) {
        return loadJpegImage(filename);
    }
    throw "unsupport format: " + filename;
}
exports.loadImage = loadImage;
function isPngFilename(filename) {
    return /\.png/i.test(filename);
}
exports.isPngFilename = isPngFilename;
function isJpegFilename(filename) {
    return /\.jpg/i.test(filename) || /\.jpeg/i.test(filename);
}
exports.isJpegFilename = isJpegFilename;
function loadPngImage(filename, expect_channels) {
    if (expect_channels === void 0) { expect_channels = 4; }
    var data = fs.readFileSync(filename);
    var m = decodePng(data, expect_channels);
    return m;
}
exports.loadPngImage = loadPngImage;
function loadJpegImage(filename, expect_channels) {
    if (expect_channels === void 0) { expect_channels = 3; }
    var data = fs.readFileSync(filename);
    var m = decodeJpg(data, expect_channels);
    return m;
}
exports.loadJpegImage = loadJpegImage;
// ----------------------------------------------------------------------------
