// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

export function isNode(): boolean {
	if(typeof process === 'object') {
		if(typeof process.versions === 'object') {
			if(typeof process.versions.node !== 'undefined') {
				return true
			}
		}
	}
	return false
}

export const is_node: boolean = isNode()

export function isUint8Array(obj:any): boolean {
	return obj instanceof Uint8Array && (!is_node || !Buffer.isBuffer(obj))
}

export function isArrayBuffer(obj:any): boolean {
	return obj instanceof ArrayBuffer
}

export function isBuffer(obj:any): boolean {
	if(!is_node) {
		return false
	}
	return Buffer.isBuffer(obj)
}

