// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#ifndef guetzli_api_h_
#define guetzli_api_h_

#include <stddef.h>
#include <stdint.h>

#include <string>

// ----------------------------------------------------------------------------

#ifndef CAPI_EXPORT
#	if defined(__EMSCRIPTEN__)
#		include <emscripten.h>
#		if defined(__cplusplus)
#			define CAPI_EXPORT(rettype) extern "C" rettype EMSCRIPTEN_KEEPALIVE
#		else
#			define CAPI_EXPORT(rettype) rettype EMSCRIPTEN_KEEPALIVE
#		endif
#	else
#		if defined(__cplusplus)
#			define CAPI_EXPORT(rettype) extern "C" rettype
#		else
#			define CAPI_EXPORT(rettype) rettype
#		endif
#	endif
#endif

// ----------------------------------------------------------------------------

#define GUETZLI_VERSION "1.0.1"

CAPI_EXPORT(const char*) guetzliGetVersion();

// ----------------------------------------------------------------------------

typedef struct guetzli_string_t guetzli_string_t;

CAPI_EXPORT(guetzli_string_t*) guetzli_string_new(int size);
CAPI_EXPORT(void) guetzli_string_delete(guetzli_string_t* p);

CAPI_EXPORT(void) guetzli_string_resize(guetzli_string_t* p, int size);
CAPI_EXPORT(int) guetzli_string_size(guetzli_string_t* p);
CAPI_EXPORT(char*) guetzli_string_data(guetzli_string_t* p);

CAPI_EXPORT(guetzli_string_t*) guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality);
CAPI_EXPORT(guetzli_string_t*) guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality);
CAPI_EXPORT(guetzli_string_t*) guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality);

// ----------------------------------------------------------------------------

bool guetzliEncodeGray(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGB(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGBA(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);

// ----------------------------------------------------------------------------

#if !defined(GUETZLI_BUILD_FOR_BROWSER)
bool DecodePng32(
	std::string* dst, const char* data, int size,
	int* width, int* height
);

bool DecodePng24(
	std::string* dst, const char* data, int size,
	int* width, int* height
);

bool EncodePng32(
	std::string* dst, const char* data, int size,
	int width, int height, int width_step /*=0*/
);

bool EncodePng24(
	std::string* dst, const char* data, int size,
	int width, int height, int width_step /*=0*/
);
#endif // GUETZLI_BUILD_FOR_BROWSER

// ----------------------------------------------------------------------------

#endif // guetzli_api_h_
