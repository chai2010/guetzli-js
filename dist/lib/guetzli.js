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
// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------
exports.version = ccapi.getVersion();
exports.minQuality = 84;
exports.maxQuality = 110;
exports.defaultQuality = 95;
function encodeImage(m, quality) {
    if (quality === void 0) { quality = exports.defaultQuality; }
    if (m.channels != 1 && m.channels != 3 && m.channels != 4) {
        throw "guetzli.encodeImage: unsupport channels:" + m.channels;
    }
    var stride = m.width * m.channels;
    if (m.stride && m.stride > 0) {
        stride = m.stride;
    }
    return ccapi.encodeImage(m.pix, m.width, m.height, m.channels, stride, quality);
}
exports.encodeImage = encodeImage;
function encodeGray(pix, width, height, stride, quality) {
    if (stride === void 0) { stride = 0; }
    if (quality === void 0) { quality = exports.defaultQuality; }
    return encodeImage({
        width: width,
        height: height,
        channels: 1,
        stride: stride,
        pix: pix
    });
}
exports.encodeGray = encodeGray;
function encodeRGB(pix, width, height, stride, quality) {
    if (stride === void 0) { stride = 0; }
    if (quality === void 0) { quality = exports.defaultQuality; }
    return encodeImage({
        width: width,
        height: height,
        channels: 3,
        stride: stride,
        pix: pix
    });
}
exports.encodeRGB = encodeRGB;
function encodeRGBA(pix, width, height, stride, quality) {
    if (stride === void 0) { stride = 0; }
    if (quality === void 0) { quality = exports.defaultQuality; }
    return encodeImage({
        width: width,
        height: height,
        channels: 4,
        stride: stride,
        pix: pix
    });
}
exports.encodeRGBA = encodeRGBA;
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
