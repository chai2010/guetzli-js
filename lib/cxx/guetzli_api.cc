// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "./guetzli_api.h"

#include <stdlib.h>
#include <string.h>

#include <string>
#include <vector>
#include <memory>

#include <guetzli/processor.h>
#include <guetzli/quality.h>
#include <guetzli/stats.h>

#if !defined(GUETZLI_BUILD_FOR_BROWSER)
#	include <lodepng.h>
#endif

// ----------------------------------------------------------------------------
// Guetzli api
// ----------------------------------------------------------------------------

const char* guetzliGetVersion() {
	return GUETZLI_VERSION;
}

// ----------------------------------------------------------------------------

struct guetzli_string_t {
	std::string str_;
};

guetzli_string_t* guetzli_string_new(int size) {
	auto p = new guetzli_string_t();
	p->str_.resize(size);
	return p;
}
void guetzli_string_delete(guetzli_string_t* p) {
	delete p;
}

void guetzli_string_resize(guetzli_string_t* p, int size) {
	p->str_.resize(size);
}
int guetzli_string_size(guetzli_string_t* p) {
	return int(p->str_.size());
}
char* guetzli_string_data(guetzli_string_t* p) {
	return (char*)(p->str_.data());
}

guetzli_string_t* guetzli_encode_Gray(const uint8_t* pix, int w, int h, int stride, float quality) {
	auto p = guetzli_string_new(0);
	if(!guetzliEncodeGray(pix, w, h, stride, quality, &p->str_)) {
		guetzli_string_delete(p);
		return NULL;
	}
	return p;
}
guetzli_string_t* guetzli_encode_RGB(const uint8_t* pix, int w, int h, int stride, float quality) {
	auto p = guetzli_string_new(0);
	if(!guetzliEncodeRGB(pix, w, h, stride, quality, &p->str_)) {
		guetzli_string_delete(p);
		return NULL;
	}
	return p;
}
guetzli_string_t* guetzli_encode_RGBA(const uint8_t* pix, int w, int h, int stride, float quality) {
	auto p = guetzli_string_new(0);
	if(!guetzliEncodeRGBA(pix, w, h, stride, quality, &p->str_)) {
		guetzli_string_delete(p);
		return NULL;
	}
	return p;
}

// ----------------------------------------------------------------------------

static void grayToRGBVector(std::vector<uint8_t>* rgb, const uint8_t* pix, int w, int h, int stride) {
	rgb->resize(w*h*3);
	if(stride == 0) {
		stride = w;
	}
	int off = 0;
	for(int i = 0; i < h; i++) {
		auto p = pix + i*stride;
		for(int j = 0; j < w; j++) {
			(*rgb)[off++] = p[j]; // R
			(*rgb)[off++] = p[j]; // G
			(*rgb)[off++] = p[j]; // B
		}
	}
	return;
}

static void rgbToRGBVector(std::vector<uint8_t>* rgb, const uint8_t* pix, int w, int h, int stride) {
	rgb->resize(w*h*3);
	if(stride == 0 || stride == w*3) {
		memcpy(rgb->data(), pix, rgb->size());
		return;
	}
	for(int i = 0; i < h; i++) {
		memcpy(&(*rgb)[i*w*3], pix+i*stride, w*3);
	}
	return;
}

static void rgbaToRGBVector(std::vector<uint8_t>* rgb, const uint8_t* pix, int w, int h, int stride) {
	rgb->resize(w*h*3);
	if(stride == 0) {
		stride = w*4;
	}
	int off = 0;
	for(int i = 0; i < h; i++) {
		auto p = pix + i*stride;
		for(int j = 0; j < w; j++) {
			(*rgb)[off++] = p[j*4+0]; // R
			(*rgb)[off++] = p[j*4+1]; // G
			(*rgb)[off++] = p[j*4+2]; // B
		}
	}
	return;
}

static bool encodeRGB(const std::vector<uint8_t>& rgb, int w, int h, float quality, std::string* output) {
	guetzli::Params params;
	params.butteraugli_target = guetzli::ButteraugliScoreForQuality(quality);
	guetzli::ProcessStats stats;

	return guetzli::Process(params, &stats, rgb, w, h, output);
}

bool guetzliEncodeGray(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output) {
	std::vector<uint8_t> rgb;
	grayToRGBVector(&rgb, pix, w, h, stride);
	return encodeRGB(rgb, w, h, quality, output);
}

bool guetzliEncodeRGB(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output) {
	std::vector<uint8_t> rgb;
	rgbToRGBVector(&rgb, pix, w, h, stride);
	return encodeRGB(rgb, w, h, quality, output);
}

bool guetzliEncodeRGBA(const uint8_t* pix, int w, int h, int stride, float quality, std::string* output) {
	std::vector<uint8_t> rgb;
	rgbaToRGBVector(&rgb, pix, w, h, stride);
	return encodeRGB(rgb, w, h, quality, output);
}

// ----------------------------------------------------------------------------
// PNG helper
// ----------------------------------------------------------------------------

#if !defined(GUETZLI_BUILD_FOR_BROWSER)

bool DecodePng32(
	std::string* dst, const char* data, int size,
	int* width, int* height
) {
	if(dst == NULL || data == NULL || size <= 0) {
		return false;
	}
	if(width == NULL || height == NULL) {
		return false;
	}

	unsigned char* img;
	unsigned w, h;

	auto err = lodepng_decode32(&img, &w, &h, (const unsigned char*)data, size);
	if(err != 0) return false;

	dst->assign((const char*)img, w*h*4);
	free(img);

	*width = w;
	*height = h;
	return true;
}

bool DecodePng24(
	std::string* dst, const char* data, int size,
	int* width, int* height
) {
	if(dst == NULL || data == NULL || size <= 0) {
		return false;
	}
	if(width == NULL || height == NULL) {
		return false;
	}

	unsigned char* img;
	unsigned w, h;

	auto err = lodepng_decode32(&img, &w, &h, (const unsigned char*)data, size);
	if(err != 0) return false;

	dst->assign((const char*)img, w*h*3);
	free(img);

	*width = w;
	*height = h;
	return true;
}

bool EncodePng32(
	std::string* dst, const char* data, int size,
	int width, int height, int width_step /*=0*/
) {
	if(dst == NULL || data == NULL || size <= 0) {
		return false;
	}
	if(width <= 0 || height <= 0) {
		return false;
	}

	if(width_step < width*4) {
		width_step = width*4;
	}

	std::string tmp;
	auto pSrcData = data;

	if(width_step > width*4) {
		tmp.resize(width*height*4);
		for(int i = 0; i < height; ++i) {
			auto ppTmp = (char*)tmp.data() + i*width*4;
			auto ppSrc = (char*)data + i*width_step;
			memcpy(ppTmp, ppSrc, width*4);
		}
		pSrcData = tmp.data();
	}

	unsigned char* png;
	size_t pngsize;

	auto err = lodepng_encode32(&png, &pngsize, (const unsigned char*)pSrcData, width, height);
	if(err != 0) return false;

	dst->assign((const char*)png, pngsize);
	free(png);

	return true;
}

bool EncodePng24(
	std::string* dst, const char* data, int size,
	int width, int height, int width_step /*=0*/
) {
	if(dst == NULL || data == NULL || size <= 0) {
		return false;
	}
	if(width <= 0 || height <= 0) {
		return false;
	}

	if(width_step < width*3) {
		width_step = width*3;
	}

	std::string tmp;
	auto pSrcData = data;

	if(width_step > width*3) {
		tmp.resize(width*height*3);
		for(int i = 0; i < height; ++i) {
			auto ppTmp = (char*)tmp.data() + i*width*3;
			auto ppSrc = (char*)data + i*width_step;
			memcpy(ppTmp, ppSrc, width*3);
		}
		pSrcData = tmp.data();
	}

	unsigned char* png;
	size_t pngsize;

	auto err = lodepng_encode24(&png, &pngsize, (const unsigned char*)pSrcData, width, height);
	if(err != 0) return false;

	dst->assign((const char*)png, pngsize);
	free(png);

	return true;
}

#endif // GUETZLI_BUILD_FOR_BROWSER

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------
