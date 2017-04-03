// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var ccapi = function () {
    try {
        return require('../build/Release/guetzli.node');
    }
    catch (err) {
        return require('../build/Debug/guetzli.node');
    }
}();
var assert = require('assert');
var utils = require('./utils');
// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------
exports.version = ccapi.getVersion();
exports.minQuality = 84;
exports.maxQuality = 110;
exports.defaultQuality = 95;
function encodeImage(m, quality) {
    if (quality === void 0) { quality = exports.defaultQuality; }
    if (m.depth != 8) {
        throw "guetzli.encodeImage: unsupport depth: " + m.depth;
    }
    if (m.channels != 1 && m.channels != 3 && m.channels != 4) {
        throw "guetzli.encodeImage: unsupport channels:" + m.channels;
    }
    return ccapi.encodeImage(m.pix, m.width, m.height, m.channels, m.stride, quality);
}
exports.encodeImage = encodeImage;
function encodeGray(pix, width, height, stride, quality) {
    return encodeImage({
        width: width,
        height: height,
        channels: 1,
        depth: 8,
        stride: stride,
        pix: pix
    });
}
exports.encodeGray = encodeGray;
function encodeRGB(pix, width, height, stride, quality) {
    return encodeImage({
        width: width,
        height: height,
        channels: 3,
        depth: 8,
        stride: stride,
        pix: pix
    });
}
exports.encodeRGB = encodeRGB;
function encodeRGBA(pix, width, height, stride, quality) {
    return encodeImage({
        width: width,
        height: height,
        channels: 4,
        depth: 8,
        stride: stride,
        pix: pix
    });
}
exports.encodeRGBA = encodeRGBA;
// ----------------------------------------------------------------------------
// PNG helper (NodeJS Only)
// ----------------------------------------------------------------------------
function decodePng24(data) {
    var m = ccapi.decodePng(data, 3);
    assert(utils.isBuffer(m.pix));
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
    assert(m.channels == 3);
    assert(m.depth == 8);
    return {
        width: m.width,
        height: m.height,
        channels: m.channels,
        depth: m.depth,
        stride: m.width * 3,
        pix: m.pix
    };
}
exports.decodePng24 = decodePng24;
function decodePng32(data) {
    var m = ccapi.decodePng(data, 4);
    assert(utils.isBuffer(m.pix));
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
    assert(m.channels == 4);
    assert(m.depth == 8);
    return {
        width: m.width,
        height: m.height,
        channels: m.channels,
        depth: m.depth,
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
// main module
// ----------------------------------------------------------------------------
if (require.main === module) {
    main(process.argv.splice(2));
}
function main(args) {
    if (args.length == 1 && args[0] == '-v') {
        console.log('guetzli-' + ccapi.getVersion());
        process.exit(0);
    }
}
// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------
