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
			'include_dirs': [
				'./guetzli-1.0.1',
				'./guetzli-1.0.1/third_party/butteraugli',
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

			'sources': [
				'guetzli_node.cc',
				'guetzli_capi.cc',

				'./guetzli/lodepng.cpp',

				'./guetzli-1.0.1/guetzli/butteraugli_comparator.cc',
				'./guetzli-1.0.1/guetzli/dct_double.cc',
				'./guetzli-1.0.1/guetzli/debug_print.cc',
				'./guetzli-1.0.1/guetzli/entropy_encode.cc',
				'./guetzli-1.0.1/guetzli/fdct.cc',
				'./guetzli-1.0.1/guetzli/gamma_correct.cc',
				'./guetzli-1.0.1/guetzli/idct.cc',
				'./guetzli-1.0.1/guetzli/jpeg_data.cc',
				'./guetzli-1.0.1/guetzli/jpeg_data_decoder.cc',
				'./guetzli-1.0.1/guetzli/jpeg_data_encoder.cc',
				'./guetzli-1.0.1/guetzli/jpeg_data_reader.cc',
				'./guetzli-1.0.1/guetzli/jpeg_data_writer.cc',
				'./guetzli-1.0.1/guetzli/jpeg_huffman_decode.cc',
				'./guetzli-1.0.1/guetzli/output_image.cc',
				'./guetzli-1.0.1/guetzli/preprocess_downsample.cc',
				'./guetzli-1.0.1/guetzli/processor.cc',
				'./guetzli-1.0.1/guetzli/quality.cc',
				'./guetzli-1.0.1/guetzli/quantize.cc',
				'./guetzli-1.0.1/guetzli/score.cc',

				'./guetzli-1.0.1/third_party/butteraugli/butteraugli/butteraugli.cc',
			],
		},
	],
}
