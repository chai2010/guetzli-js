// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var Benchmark = require("benchmark");
var b = new Benchmark.Suite();
b.add('RegExp.test', function () {
    /o/.test('Hello World!');
});
b.add('String.indexOf', function () {
    'Hello World!'.indexOf('o') > -1;
});
b.run({ 'async': true });
