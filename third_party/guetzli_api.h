// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#ifndef guetzli_api_h_
#define guetzli_api_h_

#include <stddef.h>
#include <stdint.h>

#include <string>

#define GUETZLI_VERSION "1.0.1"

const char* guetzliGetVersion();

bool guetzliEncodeGray(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGB(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGBA(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);

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

#endif // guetzli_api_h_
