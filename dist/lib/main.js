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
function decodePng24(data) {
    assert(utils.isBuffer(data));
    assert(data.length > 0);
    var m = ccapi.decodePng24(data, 3);
    assert(utils.isBuffer(m.pix));
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
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
    assert(utils.isBuffer(data));
    assert(data.length > 0);
    var m = ccapi.decodePng(data, 4);
    assert(utils.isBuffer(m.pix));
    assert(m.width > 0 && m.height > 0);
    assert(m.channels > 0 && m.depth > 0);
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
if (require.main === module) {
    main(process.argv.splice(2));
}
function main(args) {
    if (args.length == 1 && args[0] == '-v') {
        console.log('guetzli-' + ccapi.getVersion());
        process.exit(0);
    }
}
