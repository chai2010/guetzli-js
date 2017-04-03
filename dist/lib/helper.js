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
function decodePng24(data) {
    var m = ccapi.decodePng(data, 3);
    assert(m.pix.length > 0);
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
    assert(m.channels == 3);
    assert(m.depth == 8);
    return {
        width: m.width,
        height: m.height,
        channels: m.channels,
        stride: m.width * 3,
        pix: m.pix
    };
}
exports.decodePng24 = decodePng24;
function decodePng32(data) {
    var m = ccapi.decodePng(data, 4);
    assert(m.pix.length > 0);
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
    assert(m.channels == 4);
    assert(m.depth == 8);
    return {
        width: m.width,
        height: m.height,
        channels: m.channels,
        stride: m.width * 4,
        pix: m.pix
    };
}
exports.decodePng32 = decodePng32;
function encodePng24(pix, width, height, stride) {
    return ccapi.encodePng(pix, width, height, 3, stride);
}
exports.encodePng24 = encodePng24;
function encodePng32(pix, width, height, stride) {
    return ccapi.encodePng(pix, width, height, 4, stride);
}
exports.encodePng32 = encodePng32;
// ----------------------------------------------------------------------------
// JPEG helper (NodeJS Only)
// ----------------------------------------------------------------------------
function encodeJpg(pix, width, height, channels, stride, quality) {
    return ccapi.encodeJpg(pix, width, height, channels, stride, quality);
}
exports.encodeJpg = encodeJpg;
function decodeJpg(data, expect_channels) {
    if (expect_channels === void 0) { expect_channels = 3; }
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
function loadPngImage(filename) {
    var data = fs.readFileSync(filename);
    var m = decodePng24(data);
    return m;
}
exports.loadPngImage = loadPngImage;
function loadJpegImage(filename) {
    var data = fs.readFileSync(filename);
    var m = decodeJpg(data);
    return m;
}
exports.loadJpegImage = loadJpegImage;
// ----------------------------------------------------------------------------
