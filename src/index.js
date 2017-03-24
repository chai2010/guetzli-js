// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const guetzli = require('./guetzli.node');

exports.version = guetzli.getVersion()

exports.printBuffer = guetzli.printBuffer
exports.returnBuffer = guetzli.returnBuffer

if(require.main === module) {
	console.log('guetzli-' + exports.version)

	const s = Buffer.from('test');
	guetzli.printBuffer(s)

	console.log('buffer:', guetzli.returnBuffer())
}

