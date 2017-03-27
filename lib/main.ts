// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import * as greet from "./greet"

export function hi(name: string) {
	return greet.sayHello(name)
}

export function showHello(id: string, name: string): void {
	const e = document.getElementById(id)
	e.innerText = greet.sayHello(name)
}

if(require.main === module) {
	console.log(123)
	console.log(hi('abc'))
}
