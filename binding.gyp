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
				'./third_party/guetzli-1.0.1',
				'./third_party/guetzli-1.0.1/third_party/butteraugli',
				'./third_party/jpeg',
				'./third_party/png',
			],
			'link_settings': {
				'libraries': [],
				'library_dirs': [],
			},
			'xcode_settings': {
				'CLANG_CXX_LIBRARY': 'libc++',
 				'MACOSX_DEPLOYMENT_TARGET': '10.8',
				'OTHER_CFLAGS': [
					"-std=c++11",
					"-stdlib=libc++",
					'-Wno-sign-compare',
					'-Wno-unused-function',
					'-Wno-unused-private-field',
					'-Wno-unused-result',
				],
			},

			'conditions': [
				['OS=="linux"', {
					'cflags_cc': [
						"-std=c++11",
					]
				}],
			],

			'sources': [
				'./lib/cxx/guetzli_node.cc',
				'./lib/cxx/guetzli_api.cc',

				'./third_party/jpeg/jpgd.cpp',
				'./third_party/jpeg/jpge.cpp',
				'./third_party/png/lodepng.cpp',

				'./third_party/guetzli-1.0.1/guetzli/butteraugli_comparator.cc',
				'./third_party/guetzli-1.0.1/guetzli/dct_double.cc',
				'./third_party/guetzli-1.0.1/guetzli/debug_print.cc',
				'./third_party/guetzli-1.0.1/guetzli/entropy_encode.cc',
				'./third_party/guetzli-1.0.1/guetzli/fdct.cc',
				'./third_party/guetzli-1.0.1/guetzli/gamma_correct.cc',
				'./third_party/guetzli-1.0.1/guetzli/idct.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_data.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_data_decoder.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_data_encoder.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_data_reader.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_data_writer.cc',
				'./third_party/guetzli-1.0.1/guetzli/jpeg_huffman_decode.cc',
				'./third_party/guetzli-1.0.1/guetzli/output_image.cc',
				'./third_party/guetzli-1.0.1/guetzli/preprocess_downsample.cc',
				'./third_party/guetzli-1.0.1/guetzli/processor.cc',
				'./third_party/guetzli-1.0.1/guetzli/quality.cc',
				'./third_party/guetzli-1.0.1/guetzli/quantize.cc',
				'./third_party/guetzli-1.0.1/guetzli/score.cc',

				'./third_party/guetzli-1.0.1/third_party/butteraugli/butteraugli/butteraugli.cc',
			],
		},
	],
}
