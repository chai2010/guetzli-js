// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#ifndef guetzli_cxxapi_h_
#define guetzli_cxxapi_h_

#include <stddef.h>
#include <stdint.h>

#include <string>

#define GUETZLI_VERSION "1.0.1"

const char* guetzliGetVersion();

bool guetzliEncodeGray(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGB(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);
bool guetzliEncodeRGBA(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output);

#endif // guetzli_cxxapi_h_
