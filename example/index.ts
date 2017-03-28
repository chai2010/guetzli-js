// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import guetzli = require("../lib/browser")

function showVersion(id: string, version: string): void {
	const e = document.getElementById(id)
	e.innerText = version
}

showVersion('guetzli-version', guetzli.version)
