// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const fs = require('fs');

if(require.main === module) {
	let args = process.argv.splice(2)
	if(args.length != 2) {
		console.log('usage: node copy_file.js infile outfile')
		process.exit(1)
	}
	fs.createReadStream(args[0]).pipe(
		fs.createWriteStream(args[1])
	)
}

