# Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# for china user

# npm  install -g cnpm --registry=https://registy.npm.taobao.org
# cnpm install -g windows-build-tool
# cnpm install -g node-gyp

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

			'include_dirs': [
				'./src/guetzli-1.0.1',
				'./src/guetzli-1.0.1/third_party/butteraugli',
			],
			'link_settings': {
				'libraries': [],
				'library_dirs': [],
			},
			'xcode_settings': {
				'OTHER_CFLAGS': [
					"-std=c++11",
					"-stdlib=libc++",
					'-Wno-sign-compare',
					'-Wno-unused-function',
					'-Wno-unused-private-field',
				],
			},

			'conditions': [
				['OS=="linux"', {
					'cflags_cc': [
						"-std=c++11",
						"-stdlib=libc++",
					]
				}],
			],

			'sources': [
				'./src/guetzli_node.cc',
				'./src/guetzli_capi.cc',

				'./src/guetzli/lodepng.cpp',

				'./src/guetzli-1.0.1/guetzli/butteraugli_comparator.cc',
				'./src/guetzli-1.0.1/guetzli/dct_double.cc',
				'./src/guetzli-1.0.1/guetzli/debug_print.cc',
				'./src/guetzli-1.0.1/guetzli/entropy_encode.cc',
				'./src/guetzli-1.0.1/guetzli/fdct.cc',
				'./src/guetzli-1.0.1/guetzli/gamma_correct.cc',
				'./src/guetzli-1.0.1/guetzli/idct.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_data.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_data_decoder.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_data_encoder.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_data_reader.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_data_writer.cc',
				'./src/guetzli-1.0.1/guetzli/jpeg_huffman_decode.cc',
				'./src/guetzli-1.0.1/guetzli/output_image.cc',
				'./src/guetzli-1.0.1/guetzli/preprocess_downsample.cc',
				'./src/guetzli-1.0.1/guetzli/processor.cc',
				'./src/guetzli-1.0.1/guetzli/quality.cc',
				'./src/guetzli-1.0.1/guetzli/quantize.cc',
				'./src/guetzli-1.0.1/guetzli/score.cc',

				'./src/guetzli-1.0.1/third_party/butteraugli/butteraugli/butteraugli.cc',
			],
		},
	],
}
