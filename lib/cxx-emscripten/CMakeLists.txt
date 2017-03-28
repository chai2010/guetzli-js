# Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

# emcmake cmake ..

project(GUETZLI)

cmake_minimum_required(VERSION 3.5)

#------------------------------------------------------------------------------

set(CMAKE_CXX_STANDARD 14)

add_definitions(
	-DGUETZLI_BUILD_FOR_BROWSER
)

set(GUETZLI_ROOT
	../../third_party/guetzli-1.0.1
)

include_directories(AFTER
	${GUETZLI_ROOT}
	${GUETZLI_ROOT}/third_party/butteraugli
)

set(GUETZLI_SRC
	${GUETZLI_ROOT}/guetzli/butteraugli_comparator.cc
	${GUETZLI_ROOT}/guetzli/dct_double.cc
	${GUETZLI_ROOT}/guetzli/debug_print.cc
	${GUETZLI_ROOT}/guetzli/entropy_encode.cc
	${GUETZLI_ROOT}/guetzli/fdct.cc
	${GUETZLI_ROOT}/guetzli/gamma_correct.cc
	${GUETZLI_ROOT}/guetzli/idct.cc
	${GUETZLI_ROOT}/guetzli/jpeg_data.cc
	${GUETZLI_ROOT}/guetzli/jpeg_data_decoder.cc
	${GUETZLI_ROOT}/guetzli/jpeg_data_encoder.cc
	${GUETZLI_ROOT}/guetzli/jpeg_data_reader.cc
	${GUETZLI_ROOT}/guetzli/jpeg_data_writer.cc
	${GUETZLI_ROOT}/guetzli/jpeg_huffman_decode.cc
	${GUETZLI_ROOT}/guetzli/output_image.cc
	${GUETZLI_ROOT}/guetzli/preprocess_downsample.cc
	${GUETZLI_ROOT}/guetzli/processor.cc
	${GUETZLI_ROOT}/guetzli/quality.cc
	${GUETZLI_ROOT}/guetzli/quantize.cc
	${GUETZLI_ROOT}/guetzli/score.cc

	${GUETZLI_ROOT}/third_party/butteraugli/butteraugli/butteraugli.cc
)

#------------------------------------------------------------------------------

add_executable(guetzli_js
	main.cc

	../cxx/guetzli_api.cc

	${GUETZLI_SRC}
)

install(TARGETS guetzli_js
	RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
	LIBRARY DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
	ARCHIVE DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
)

#------------------------------------------------------------------------------
