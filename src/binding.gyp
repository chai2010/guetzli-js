# Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# npm  install -g cnpm --registry=https://registy.npm.taobao.org
# cnpm install -g windows-build-tool

# node-gyp install --dist-url https://npm.taobao.org/mirrors/node

# node-gyp configure
# node-gyp build
# node-gyp build --debug
# node-gyp build --release

{
	'variables': {
		'name': 'guetzli',
	},
	'target_defaults': {
		'defines': [],
	},
	'targets': [
		{
			'target_name': '<(name)',

			'defines': ['FOO'],
			'include_dirs': [],
			'link_settings': {
				'libraries': [],
				'library_dirs': [],
			},

			'sources': [
				'hello.cc',
			],
		},
	],
}
