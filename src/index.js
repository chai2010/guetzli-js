// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const guetzli = require('./guetzli.node');

exports.hello = guetzli.hello

if(require.main === module) {
	console.log(guetzli.hello())
}

