// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const fs = require('fs')
const guetzli = require('./guetzli.node')

const version = guetzli.getVersion()

const minQuality = 84
const maxQuality = 110
const defaultQuality = 95

exports.version = version

exports.minQuality = minQuality
exports.maxQuality = maxQuality
exports.defaultQuality = defaultQuality

// function(buffer, width, height, stride, quality) -> Buffer
exports.encodeGray = guetzli.encodeGray
exports.encodeRGB = guetzli.encodeRGB
exports.encodeRGBA = guetzli.encodeRGBA

// function(data) -> {pix, width, height, channels, depth}
exports.decodePng24 = guetzli.decodePng24
exports.decodePng32 = guetzli.decodePng32

if(require.main === module) {
	main(process.argv.splice(2))
}

function main(args) {
	if(args.length == 1 && args[0] == '-v') {
		console.log('guetzli-' + exports.version)
		process.exit(0)
	}
	if(args.length == 1 && args[0] == '-h') {
		console.log('Usage: guetzli input_filename output_filename')
		process.exit(0)
	}

	if(args.length != 2) {
		process.exit(0)
	}

	// load png
	let data = fs.readFileSync(args[0])

	// decode png image
	let m = guetzli.decodePng32(data)

	// encode jpg image
	let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, defaultQuality)

	// save jpg
	fs.writeFileSync(args[1], jpegData)

	// OK
	console.log('Done')
}
