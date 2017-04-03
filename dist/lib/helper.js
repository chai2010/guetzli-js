// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
function isNode() {
    if (typeof process === 'object') {
        if (typeof process.versions === 'object') {
            if (typeof process.versions.node !== 'undefined') {
                return true;
            }
        }
    }
    return false;
}
exports.isNode = isNode;
exports.is_node = isNode();
function isUint8Array(obj) {
    return obj instanceof Uint8Array && (!exports.is_node || !Buffer.isBuffer(obj));
}
exports.isUint8Array = isUint8Array;
function isArrayBuffer(obj) {
    return obj instanceof ArrayBuffer;
}
exports.isArrayBuffer = isArrayBuffer;
function isBuffer(obj) {
    if (!exports.is_node) {
        return false;
    }
    return Buffer.isBuffer(obj);
}
exports.isBuffer = isBuffer;
