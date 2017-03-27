// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

function isNode() {
	if(typeof process === 'object') {
		if(typeof process.versions === 'object') {
			if(typeof process.versions.node !== 'undefined') {
				return true
			}
		}
	}
	return false
}

var is_node = isNode()

function isUint8Array(obj:any) {
	return obj instanceof Uint8Array && (!is_node || !Buffer.isBuffer(obj))
}

function isArrayBuffer(obj:any) {
	return obj instanceof ArrayBuffer
}

function isBuffer(obj:any) {
	if(!is_node) {
		return false
	}
	return Buffer.isBuffer(obj)
}

exports.isNode = isNode
exports.isUint8Array = isUint8Array
exports.isArrayBuffer = isArrayBuffer
exports.isBuffer = isBuffer
