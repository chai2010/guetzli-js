// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "guetzli_capi.h"

#include <string.h>

#include <string>
#include <vector>
#include <memory>

#include <guetzli/processor.h>
#include <guetzli/quality.h>
#include <guetzli/stats.h>

const char* guetzliGetVersion() {
	return GUETZLI_VERSION;
}

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
