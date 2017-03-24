// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const guetzli = require('./guetzli.node');

exports.version = guetzli.getVersion()

exports.encodeGray = guetzli.encodeGray
exports.encodeRGB = guetzli.encodeRGB
exports.encodeRGBA = guetzli.encodeRGBA

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
		console.log('Usage: guetzli input_filename output_filename')
		process.exit(1)
	}

	// load png
	// decode png image
	// encode jpg image
	// save jpg

	console.log('TODO')
}
