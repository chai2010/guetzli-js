// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var guetzli = require("./guetzli");
var helper = require("./helper");
var guetzli_asm = require("./cxx-emscripten/guetzli.out");
var fs = require("fs");
var path = require("path");
// ----------------------------------------------------------------------------
var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
var beesGray = helper.loadPngImage(testdir + '/bees-small.png', 1); // 144x84
var beesRGB = helper.loadPngImage(testdir + '/bees-small.png', 3); // 144x84
var beesRGBA = helper.loadPngImage(testdir + '/bees-small.png', 4); // 144x84
var lenaGray = helper.loadJpegImage(testdir + '/lena.jpg', 1); // 512x512
var lenaRGB = helper.loadJpegImage(testdir + '/lena.jpg', 3); // 512x512
var lenaRGBA = helper.loadJpegImage(testdir + '/lena.jpg', 4); // 512x512
// ----------------------------------------------------------------------------
exports.name = 'Guetzli';
exports.tests = {
    'encodeImage.bees-small.rgb': function () {
        guetzli.encodeImage(beesRGB);
    },
    'encodeImage.asm.bees-small.rgb': function () {
        guetzli_asm.encodeImage(beesRGB);
    },
    'helper.encodeJpg.bees-small.rgb': function () {
        helper.encodeJpg(beesRGB.pix, beesRGB.width, beesRGB.height, beesRGB.channels);
    },
    'helper.encodePng.bees-small.rgb': function () {
        helper.encodePng(beesRGB.pix, beesRGB.width, beesRGB.height, beesRGB.channels);
    }
};
// ----------------------------------------------------------------------------
