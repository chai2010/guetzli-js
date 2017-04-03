// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// npm install nodeunit -g

import * as pkg from "./main"

import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

interface T {
	ok(value: any, message?: string): void
	equal(actual: any, expected: any, message?: string): void
	notEqual(actual: any, expected: any, message?: string): void
	deepEqual(actual: any, expected: any, message?: string): void
	notDeepEqual(acutal: any, expected: any, message?: string): void
	strictEqual(actual: any, expected: any, message?: string): void
	notStrictEqual(actual: any, expected: any, message?: string): void
	throws(block: Function, error: Function, message?: string): void
	doesNotThrow(block: Function, error: Function, message?: string): void
	ifError(value: any): void
	expect(amount:number): void
	done(): void
}

exports.testVersion = function(t: T) {
	t.ok(pkg.version == '1.0.1')
	t.ok(/^\d+\.\d+\.\d+$/.test(pkg.version))
	t.done()
}

exports.testIsPngFilename = function(t: T) {
	t.ok(isPngFilename('.png'))
	t.ok(isPngFilename('.PNG'))
	t.ok(isPngFilename('.PnG'))

	t.ok(isPngFilename('1.png'))
	t.ok(isPngFilename('1.PNG'))
	t.ok(isPngFilename('1.pNG'))

	t.ifError(isPngFilename('png'))
	t.ifError(isPngFilename('1.jpg'))

	t.done()
}

exports.testIsJpegFilename = function(t: T) {
	t.ok(isJpegFilename('.jpg'))
	t.ok(isJpegFilename('.jPG'))
	t.ok(isJpegFilename('.jpeg'))
	t.ok(isJpegFilename('.jpEg'))

	t.ok(isJpegFilename('.jpg'))
	t.ok(isJpegFilename('1.jpeg'))

	t.done()
}

exports.testLoadImage_png = function(t: T) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
	let m = loadImage(testdir + '/bees.png') // 444x258
	t.ok(isValidImage(m))
	t.ok(m.width == 444)
	t.ok(m.height == 258)
	t.done()
}

exports.testLoadImage_jpeg = function(t: T) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
	let m = loadImage(testdir + '/lena.jpg')
	t.ok(isValidImage(m))
	t.done()
}

exports.testGuetzliEncode = function(t: T) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');

	// 1. load png
	let m1 = loadImage(testdir + '/bees.png')

	// 2. guetzli encode
	let jepgData = pkg.encodeImage(m1)

	// 3. decode jpeg
	let m2 = pkg.decodeJpg(jepgData)

	// 4. compare image
	let diff = averageDelta(m1, m2)
	t.ok(diff < 20, 'diff = ' + diff)

	t.done()
}

function loadImage(filename: string): pkg.Image {
	if(isPngFilename(filename)) {
		return loadPngImage(filename)
	}
	if(isJpegFilename(filename)) {
		return loadJpegImage(filename)
	}
	throw "unsupport format: " + filename
}

function isPngFilename(filename: string): boolean {
	return /\.png/i.test(filename)
}

function isJpegFilename(filename: string): boolean {
	return /\.jpg/i.test(filename) || /\.jpeg/i.test(filename)
}

function loadPngImage(filename:string): pkg.Image {
	let data = fs.readFileSync(filename)
	let m = pkg.decodePng24(data)
	return m
}

function loadJpegImage(filename:string): pkg.Image {
	let data = fs.readFileSync(filename)
	let m = pkg.decodeJpg(data)
	return m
}

function isValidImage(m: pkg.Image): boolean {
	return m.width > 0 && m.height > 0 && m.channels > 0 && m.depth > 0 && m.pix.length > 0
}

// averageDelta returns the average delta in RGB space. The two images must
// have the same bounds.
function averageDelta(m0: pkg.Image, m1: pkg.Image): number {
	assert(m0.width == m1.width)
	assert(m0.height == m1.height)
	assert(m0.channels == m1.channels)
	assert(m0.depth == m1.depth)
	assert(m0.depth == 8)

	let sum = 0, n = 0
	for(let y = 0; y < m0.height; y++) {
		for(let x = 0; x < m0.width; x++) {
			for(let k = 0; k < m0.channels && k < 3; k++) {
				let c0 = colorAt(m0, x, y, k)
				let c1 = colorAt(m1, x, y, k)

				sum += delta(c0, c1)
				n++
			}
		}
	}

	return sum/n
}

function colorAt(m: pkg.Image, x: number, y: number, iChannel: number): number {
	assert(m.depth == 8)
	let stride = m.stride>0? m.stride: m.width*m.channels;
	let off = y*stride+x*m.channels+iChannel
	return m.pix[off]
}

function delta(a: number, b: number): number {
	return (a > b)? (a-b): (b-a)
}
