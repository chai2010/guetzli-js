// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// npm install http-server -g
// http-server dist -a 127.0.0.1 -p 8080 -c-1

import guetzli = require("../lib/browser")

declare let window: any
declare let document: any

declare function saveAs(data: any, filename?: string, disableAutoBOM?: boolean): void

class MyApp {
	main() {
		$(document).ready(() => {
			console.log('showVersion begin')
			this.showVersion('guetzli-version', "guetzli-" + guetzli.version)
			console.log('showVersion end')

			this.onDocReady()
		})

		$("#saveAsBtnRun").click(() => {
			console.log('saveAsBtnRun begin')

			let data = this.encodeImage('myCanvas')
			let blob = new Blob([data.buffer], {type: "application/octet-stream;"})
			saveAs(blob, "guetzli-demo.jpg")

			console.log('saveAsBtnRun end')
		})
	}

	onDocReady() {
		let canvas = document.getElementById('myCanvas')
		let ctx = canvas.getContext('2d')

		ctx.fillStyle = '#663300'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		let m = new Image()
		m.src = '../testdata/bees.png'
		m.onload = function() {
			ctx.drawImage(m, 5, 5, canvas.width-10, canvas.height-10)
		}
	}

	encodeImage(id: string): Uint8Array {
		console.log("encodeImage:", '1')

		let canvas = document.getElementById(id)
		let ctx = canvas.getContext('2d')
		let imgd = ctx.getImageData(0, 0, canvas.width, canvas.height)

		console.log("width:", canvas.width)
		console.log("height:", canvas.height)
		console.log("imgd.data len:", imgd.data.length)

		return guetzli.encodeImage({
			width:    canvas.width,
			height:   canvas.height,
			channels: 4,
			depth:    8,
			stride:   canvas.width*4,
			pix:      imgd.data,
		})
	}

	showVersion(id: string, version: string): void {
		const e = document.getElementById(id)
		e.innerText = version
	}
}

window['MyApp'] = new MyApp()

