// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// npm install nodeunit -g

import * as image from "./image"
import * as guetzli from "./guetzli"
import * as helper from "./helper"

import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path'

import * as nodeunit from 'nodeunit'

export function testVersion(t: nodeunit.Test) {
	t.ok(guetzli.version == '1.0.1')
	t.ok(/^\d+\.\d+\.\d+$/.test(guetzli.version))
	t.done()
}

export function testIsPngFilename(t: nodeunit.Test) {
	t.ok(helper.isPngFilename('.png'))
	t.ok(helper.isPngFilename('.PNG'))
	t.ok(helper.isPngFilename('.PnG'))

	t.ok(helper.isPngFilename('1.png'))
	t.ok(helper.isPngFilename('1.PNG'))
	t.ok(helper.isPngFilename('1.pNG'))

	t.ifError(helper.isPngFilename('png'))
	t.ifError(helper.isPngFilename('1.jpg'))

	t.done()
}

export function testIsJpegFilename(t: nodeunit.Test) {
	t.ok(helper.isJpegFilename('.jpg'))
	t.ok(helper.isJpegFilename('.jPG'))
	t.ok(helper.isJpegFilename('.jpeg'))
	t.ok(helper.isJpegFilename('.jpEg'))

	t.ok(helper.isJpegFilename('.jpg'))
	t.ok(helper.isJpegFilename('1.jpeg'))

	t.done()
}

export function testLoadImage_png(t: nodeunit.Test) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
	let m = helper.loadImage(testdir + '/bees.png') // 444x258
	t.ok(isValidImage(m))
	t.ok(m.width == 444)
	t.ok(m.height == 258)
	t.done()
}

export function testLoadImage_jpeg(t: nodeunit.Test) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');
	let m = helper.loadImage(testdir + '/lena.jpg')
	t.ok(isValidImage(m))
	t.done()
}

export function testGuetzliEncode(t: nodeunit.Test) {
	let testdir = path.join(path.dirname(fs.realpathSync(__filename)), '../testdata');

	// 1. load png
	let m1 = helper.loadImage(testdir + '/bees.png')

	// 2. guetzli encode
	let jepgData = guetzli.encodeImage(m1)

	// 3. decode jpeg
	let m2 = helper.decodeJpg(jepgData)

	// 4. compare image
	let diff = averageDelta(m1, m2)
	t.ok(diff < 20, 'diff = ' + diff)

	t.done()
}

function isValidImage(m: image.Image): boolean {
	return m.width > 0 && m.height > 0 && m.channels > 0 && m.pix.length > 0
}

// averageDelta returns the average delta in RGB space. The two images must
// have the same bounds.
function averageDelta(m0: image.Image, m1: image.Image): number {
	assert(m0.width == m1.width)
	assert(m0.height == m1.height)
	assert(m0.channels > 0 && m1.channels > 0)

	let sum = 0, n = 0
	for(let y = 0; y < m0.height; y++) {
		for(let x = 0; x < m0.width; x++) {
			for(let k = 0; k < m0.channels && m1.channels && k < 3; k++) {
				let c0 = image.colorAt(m0, x, y, k)
				let c1 = image.colorAt(m1, x, y, k)

				sum += delta(c0, c1)
				n++
			}
		}
	}

	return sum/n
}

function delta(a: number, b: number): number {
	return (a > b)? (a-b): (b-a)
}

// ----------------------------------------------------------------------------
// try async/await

async function delay(ms: number) {
	return new Promise<void>(resole => {
		setTimeout(resole, ms)
	})
}

async function main(...args: string[]) {
	for(const arg of args) {
		console.log(arg)
		await delay(300)
	}
}

if(require.main === module) {
	main('A', 'B', 'C')
}

// ----------------------------------------------------------------------------
