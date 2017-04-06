// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

const fs = require('fs')
const path = require('path')

const PKG_ROOT = path.join(path.dirname(fs.realpathSync(__filename)), '..');

function removeDirectory(path) {
	if(fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file, index) {
			const curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				removeDirectory(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		})
		fs.rmdirSync(path);
	}
}

function copyFile(fromPath, toPath) {
	fs.writeFileSync(toPath, fs.readFileSync(fromPath))
}

if(require.main === module) {
	copyFile(PKG_ROOT+'/build/Release/guetzli.node', PKG_ROOT+'/dist/build/Release/guetzli.node')
	removeDirectory(PKG_ROOT+'/build')
}
