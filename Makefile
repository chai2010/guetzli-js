# Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

default: guetzli.node

guetzli.node: Makefile binding.gyp
	node-gyp configure
	node-gyp build

rebuild:
	node-gyp rebuild
	cmake -E copy_directory build dist/build

run: guetzli.node
	node dist/lib/guetzli-cli.js -h

test: guetzli.node
	node dist/lib/guetzli-cli.js testdata/bees.png a.out.jpg

deps:
	npm  install -g cnpm --registry=https://registy.npm.taobao.org
	cnpm install -g windows-build-tool
	node-gyp install --dist-url https://npm.taobao.org/mirrors/node

clean:
	cmake -E remove_directory build
	cmake -E remove_directory zz_build_win64_release
	cmake -E remove_directory zz_build_win32_release
	cmake -E remove_directory zz_build_debug_proj_mt_tmp
