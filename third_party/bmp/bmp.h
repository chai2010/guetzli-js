// Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#ifndef _bmp_h_
#define _bmp_h_

#include <string>

bool bmpDecode(
	std::string* dst, const char* data, int size,
	int* width, int* height, int* channels
);

bool bmpEncode(
	std::string* dst, const char* pix,
	int width, int height, int stride,
	int channels
);

#endif // _bmp_h_

