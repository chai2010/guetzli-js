// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var greet = require("./greet");
var foo = require("../base/foo");
function hi(name) {
    return greet.sayHello(name);
}
exports.hi = hi;
function showHello(id, name) {
    var e = document.getElementById(id);
    e.innerText = greet.sayHello(name) + foo.foo();
}
exports.showHello = showHello;
if (require.main === module) {
    console.log(123);
    console.log(hi('abc'));
}
