// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
var fs = require("fs");
var guetzli = require("./guetzli");
var helper = require("./helper");
function main() {
    var args = process.argv.splice(2);
    if (args.length == 1 && args[0] == '-v') {
        console.log('guetzli-' + guetzli.version);
        process.exit(0);
    }
    if (args.length == 1 && args[0] == '-h') {
        console.log('Usage: guetzli input_filename output_filename');
        process.exit(0);
    }
    if (args.length != 2) {
        console.log('Usage: guetzli input_filename output_filename');
        process.exit(0);
    }
    // load png
    var data = fs.readFileSync(args[0]);
    // decode png image
    var m = helper.decodePng(data);
    // encode jpg image
    var jpegData = guetzli.encodeRGBA(m.pix, m.width, m.height, 0, guetzli.defaultQuality);
    // save jpg
    fs.writeFileSync(args[1], jpegData);
    // OK
    console.log('Done');
}
exports.main = main;
