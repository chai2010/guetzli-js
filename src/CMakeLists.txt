# Copyright 2013 <chaishushan{AT}gmail.com>. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

project(NODE_HELLO)
cmake_minimum_required(VERSION 3.5)

#------------------------------------------------------------------------------

set(CMAKE_CXX_STANDARD 11)

execute_process(COMMAND node -v OUTPUT_VARIABLE NODE_VERSION) # v7.7.3\n
string(STRIP ${NODE_VERSION} NODE_VERSION)                    # v7.7.3
string(SUBSTRING ${NODE_VERSION} 1 8 NODE_VERSION)            # 7.7.3

if(WIN32)
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
	# TODO
endif()

if(UNIX)
	# TODO
endif()

#------------------------------------------------------------------------------

add_library(hellodll SHARED
	./hello.cc
)
set_target_properties(hellodll
	PROPERTIES OUTPUT_NAME "hello"
	SUFFIX ".node"
)
target_link_libraries(hellodll
	${NODE_DEV_LIB}
)

install(TARGETS hellodll
	RUNTIME DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
	LIBRARY DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
	ARCHIVE DESTINATION ${CMAKE_CURRENT_SOURCE_DIR}
)

#------------------------------------------------------------------------------
