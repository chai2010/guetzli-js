# Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

#------------------------------------------------------------------------------

# for china user

# npm  install -g cnpm --registry=https://registy.npm.taobao.org
# cnpm install -g windows-build-tool
# cnpm install -g node-gyp

# node-gyp install --dist-url https://npm.taobao.org/mirrors/node

#------------------------------------------------------------------------------

project(NODE_GUETZLI)

cmake_minimum_required(VERSION 3.5)

#------------------------------------------------------------------------------

set(CMAKE_CXX_STANDARD 11)

if(WIN32)
	execute_process(COMMAND node -v OUTPUT_VARIABLE NODE_VERSION) # v7.7.3\n
	string(STRIP ${NODE_VERSION} NODE_VERSION)                    # v7.7.3
	string(SUBSTRING ${NODE_VERSION} 1 8 NODE_VERSION)            # 7.7.3

	set(NODE_DEV_ROOT $ENV{USERPROFILE}/.node-gyp/${NODE_VERSION})
	set(NODE_DEV_LIB  node.lib)

	include_directories(AFTER
		${NODE_DEV_ROOT}/include/node
	)

	if(CMAKE_SIZEOF_VOID_P EQUAL 8)
		link_directories(
			${NODE_DEV_ROOT}/x64
		)
	else()
		link_directories(
			${NODE_DEV_ROOT}/x86
		)
	endif()
endif()

if(APPLE)
	execute_process(COMMAND node -v OUTPUT_VARIABLE NODE_VERSION) # v7.7.3\n
	string(STRIP ${NODE_VERSION} NODE_VERSION)                    # v7.7.3
	string(SUBSTRING ${NODE_VERSION} 1 8 NODE_VERSION)            # 7.7.3

	# /usr/local/include/node
	# $ENV{HOME}/.node-gyp/x.y.z/include/node
	include_directories(AFTER
		$ENV{HOME}/.node-gyp/${NODE_VERSION}/include/node
	)
	set(CMAKE_SHARED_LIBRARY_CREATE_CXX_FLAGS
		"${CMAKE_SHARED_LIBRARY_CREATE_CXX_FLAGS} -undefined dynamic_lookup"
	)
endif()

if(UNIX)
	execute_process(COMMAND node -v OUTPUT_VARIABLE NODE_VERSION) # v7.7.3\n
	string(STRIP ${NODE_VERSION} NODE_VERSION)                    # v7.7.3
	string(SUBSTRING ${NODE_VERSION} 1 8 NODE_VERSION)            # 7.7.3

	# /usr/local/include/node
	# $ENV{HOME}/.node-gyp/x.y.z/include/node
	include_directories(AFTER
		$ENV{HOME}/.node-gyp/${NODE_VERSION}/include/node
	)
	set(CMAKE_SHARED_LIBRARY_CREATE_CXX_FLAGS
		"${CMAKE_SHARED_LIBRARY_CREATE_CXX_FLAGS} -undefined dynamic_lookup"
	)
endif()

#------------------------------------------------------------------------------

set(GUETZLI_ROOT
	./third_party/guetzli-1.0.1
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

include_directories(AFTER
	./third_party/jpeg
	./third_party/png
)

add_library(guetzli_node SHARED
	./lib/cxx/guetzli_node.cc
	./lib/cxx/guetzli_api.cc

	./third_party/jpeg/jpgd.cpp
	./third_party/jpeg/jpge.cpp
	./third_party/png/lodepng.cpp

	${GUETZLI_SRC}
)
set_target_properties(guetzli_node
	PROPERTIES OUTPUT_NAME "guetzli"
	PREFIX ""
	SUFFIX ".node"
)
target_link_libraries(guetzli_node
	${NODE_DEV_LIB}
)

if(CMAKE_BUILD_TYPE STREQUAL "Debug")
	install(TARGETS guetzli_node
		RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Debug
		LIBRARY DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Debug
		ARCHIVE DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Debug
	)
else()
	install(TARGETS guetzli_node
		RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Release
		LIBRARY DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Release
		ARCHIVE DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}/build/Release
	)
endif()



#------------------------------------------------------------------------------
