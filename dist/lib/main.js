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
    switch (m.channels) {
        case 1: return encodeGray(m.pix, m.width, m.height, m.stride, quality);
        case 3: return encodeRGB(m.pix, m.width, m.height, m.stride, quality);
        case 4: return encodeRGBA(m.pix, m.width, m.height, m.stride, quality);
    }
    throw "guetzli.encodeImage: unknown channels:" + m.channels;
}
exports.encodeImage = encodeImage;
function encodeGray(pix, width, height, stride, quality) {
    assert(utils.isBuffer(pix));
    assert((width | 0) > 0 && (height | 0) > 0);
    assert((stride | 0) == 0 || (stride | 0) >= (width | 0) * 1);
    assert((quality | 0) >= this.minQuality && (quality | 0) <= this.maxQuality);
    return ccapi.encodeGray(pix, width, height, stride, quality);
}
exports.encodeGray = encodeGray;
function encodeRGB(pix, width, height, stride, quality) {
    assert(utils.isBuffer(pix));
    assert((width | 0) > 0 && (height | 0) > 0);
    assert((stride | 0) == 0 || (stride | 0) >= (width | 0) * 3);
    assert((quality | 0) >= this.minQuality && (quality | 0) <= this.maxQuality);
    return ccapi.encodeRGB(pix, width, height, stride, quality);
}
exports.encodeRGB = encodeRGB;
function encodeRGBA(pix, width, height, stride, quality) {
    assert(utils.isBuffer(pix));
    assert((width | 0) > 0 && (height | 0) > 0);
    assert((stride | 0) == 0 || (stride | 0) >= (width | 0) * 4);
    assert((quality | 0) >= this.minQuality && (quality | 0) <= this.maxQuality);
    return ccapi.encodeRGBA(pix, width, height, stride, quality);
}
exports.encodeRGBA = encodeRGBA;
function decodePng24(data) {
    assert(utils.isBuffer(data));
    assert(data.length > 0);
    var m = ccapi.decodePng24(data);
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
    var m = ccapi.decodePng32(data);
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
