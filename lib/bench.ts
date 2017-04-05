// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import * as image from "./image"
import * as guetzli from "./guetzli"
import * as helper from "./helper"

import guetzli_asm = require("./cxx-emscripten/guetzli.out")

import * as fs from 'fs'
import * as path from 'path'

// ----------------------------------------------------------------------------

const testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata')

const beesGray = helper.loadPngImage(testdir + '/bees-small.png', 1) // 144x84
const beesRGB  = helper.loadPngImage(testdir + '/bees-small.png', 3) // 144x84
const beesRGBA = helper.loadPngImage(testdir + '/bees-small.png', 4) // 144x84

const lenaGray = helper.loadJpegImage(testdir + '/lena.jpg', 1) // 512x512
const lenaRGB  = helper.loadJpegImage(testdir + '/lena.jpg', 3) // 512x512
const lenaRGBA = helper.loadJpegImage(testdir + '/lena.jpg', 4) // 512x512

// ----------------------------------------------------------------------------

export const name: string = 'Guetzli'

export const tests = {
	'encodeImage.bees-small.rgb': function() {
		guetzli.encodeImage(beesRGB)
	},
	'encodeImage.asm.bees-small.rgb': function() {
		guetzli_asm.encodeImage(beesRGB)
	},
	'helper.encodeJpg.bees-small.rgb': function() {
		helper.encodeJpg(beesRGB.pix, beesRGB.width, beesRGB.height, beesRGB.channels)
	},
	'helper.encodePng.bees-small.rgb': function() {
		helper.encodePng(beesRGB.pix, beesRGB.width, beesRGB.height, beesRGB.channels)
	},
}

// ----------------------------------------------------------------------------
