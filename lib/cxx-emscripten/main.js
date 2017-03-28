// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Module = require('./guetzli.out')

// CAPI_EXPORT(const char*) guetzliGetVersion();
var guetzliGetVersion = Module.cwrap(
	'guetzliGetVersion', 'string', []
)

if(require.main === module) {
	console.log('guetzli-', guetzliGetVersion())
}
