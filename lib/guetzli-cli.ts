// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const fs = require('fs')
const guetzli = require('../index.js')

if(require.main === module) {
	main(process.argv.splice(2))
}

function main(args: string[]) {
	if(args.length == 1 && args[0] == '-v') {
		console.log('guetzli-' + guetzli.version)
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
	let jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality)

	// save jpg
	fs.writeFileSync(args[1], jpegData)

	// OK
	console.log('Done')
}
