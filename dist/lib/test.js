// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var pkg = require("./main");
exports.testVersion = function (t) {
    t.ok(pkg.version == '1.0.1');
    t.ok(/^\d+\.\d+\.\d+$/.test(pkg.version));
    t.done();
};
