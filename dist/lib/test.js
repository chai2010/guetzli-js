// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// npm install nodeunit -g
var image = require("./image");
var guetzli = require("./guetzli");
var helper = require("./helper");
var assert = require("assert");
var fs = require("fs");
var path = require("path");
function testVersion(t) {
    t.ok(guetzli.version == '1.0.1');
    t.ok(/^\d+\.\d+\.\d+$/.test(guetzli.version));
    t.done();
}
exports.testVersion = testVersion;
function testIsPngFilename(t) {
    t.ok(helper.isPngFilename('.png'));
    t.ok(helper.isPngFilename('.PNG'));
    t.ok(helper.isPngFilename('.PnG'));
    t.ok(helper.isPngFilename('1.png'));
    t.ok(helper.isPngFilename('1.PNG'));
    t.ok(helper.isPngFilename('1.pNG'));
    t.ifError(helper.isPngFilename('png'));
    t.ifError(helper.isPngFilename('1.jpg'));
    t.done();
}
exports.testIsPngFilename = testIsPngFilename;
function testIsJpegFilename(t) {
    t.ok(helper.isJpegFilename('.jpg'));
    t.ok(helper.isJpegFilename('.jPG'));
    t.ok(helper.isJpegFilename('.jpeg'));
    t.ok(helper.isJpegFilename('.jpEg'));
    t.ok(helper.isJpegFilename('.jpg'));
    t.ok(helper.isJpegFilename('1.jpeg'));
    t.done();
}
exports.testIsJpegFilename = testIsJpegFilename;
function testLoadImage_png(t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    var m = helper.loadImage(testdir + '/bees.png'); // 444x258
    t.ok(isValidImage(m));
    t.ok(m.width == 444);
    t.ok(m.height == 258);
    t.done();
}
exports.testLoadImage_png = testLoadImage_png;
function testLoadImage_jpeg(t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    var m = helper.loadImage(testdir + '/lena.jpg');
    t.ok(isValidImage(m));
    t.done();
}
exports.testLoadImage_jpeg = testLoadImage_jpeg;
function testGuetzliEncode(t) {
    var testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
    // 1. load png
    var m1 = helper.loadImage(testdir + '/bees.png');
    // 2. guetzli encode
    var jepgData = guetzli.encodeImage(m1);
    // 3. decode jpeg
    var m2 = helper.decodeJpg(jepgData);
    // 4. compare image
    var diff = averageDelta(m1, m2);
    t.ok(diff < 20, 'diff = ' + diff);
    t.done();
}
exports.testGuetzliEncode = testGuetzliEncode;
function isValidImage(m) {
    return m.width > 0 && m.height > 0 && m.channels > 0 && m.pix.length > 0;
}
// averageDelta returns the average delta in RGB space. The two images must
// have the same bounds.
function averageDelta(m0, m1) {
    assert(m0.width == m1.width);
    assert(m0.height == m1.height);
    assert(m0.channels > 0 && m1.channels > 0);
    var sum = 0, n = 0;
    for (var y = 0; y < m0.height; y++) {
        for (var x = 0; x < m0.width; x++) {
            for (var k = 0; k < m0.channels && m1.channels && k < 3; k++) {
                var c0 = image.colorAt(m0, x, y, k);
                var c1 = image.colorAt(m1, x, y, k);
                sum += delta(c0, c1);
                n++;
            }
        }
    }
    return sum / n;
}
function delta(a, b) {
    return (a > b) ? (a - b) : (b - a);
}
// ----------------------------------------------------------------------------
// try async/await
function delay(ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resole) {
                    setTimeout(resole, ms);
                })];
        });
    });
}
function main() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var _i, args_1, arg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, args_1 = args;
                    _a.label = 1;
                case 1:
                    if (!(_i < args_1.length)) return [3 /*break*/, 4];
                    arg = args_1[_i];
                    console.log(arg);
                    return [4 /*yield*/, delay(300)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    main('A', 'B', 'C');
}
// ----------------------------------------------------------------------------
