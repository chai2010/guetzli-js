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
#	include <jpge.h>
#	include <jpgd.h>
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

static bool DecodePng32(
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

static bool DecodePng24(
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

bool DecodePngGray(std::string* dst, const char* data, int size, int* width, int* height) {
	std::string s;
	if(!DecodePng24(&s, data, size, width, height)) {
		dst->clear();
		return false;
	}

	dst->resize(s.size()/3);

	auto pSrc = (const uint8_t*)s.data();
	auto pDst = (uint8_t*)dst->data();

	int k = 0;
	for(int i = 0; i < dst->size(); i++) {
		auto R = pSrc[k++];
		auto G = pSrc[k++];
		auto B = pSrc[k++];
		pDst[i] = (R+G+B)/3;
	}

	return true;
}

bool DecodePngRGB(std::string* dst, const char* data, int size, int* width, int* height) {
	return DecodePng24(dst, data, size, width, height);
}
bool DecodePngRGBA(std::string* dst, const char* data, int size, int* width, int* height) {
	return DecodePng32(dst, data, size, width, height);
}

static bool EncodePng32(
	std::string* dst, const char* data, int width, int height, int stride /*=0*/
) {
	if(dst == NULL || data == NULL) {
		return false;
	}
	if(width <= 0 || height <= 0) {
		return false;
	}

	if(stride < width*4) {
		stride = width*4;
	}

	std::string tmp;
	auto pSrcData = data;

	if(stride > width*4) {
		tmp.resize(width*height*4);
		for(int i = 0; i < height; ++i) {
			auto ppTmp = (char*)tmp.data() + i*width*4;
			auto ppSrc = (char*)data + i*stride;
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

static bool EncodePng24(
	std::string* dst, const char* data, int width, int height, int stride /*=0*/
) {
	if(dst == NULL || data == NULL) {
		return false;
	}
	if(width <= 0 || height <= 0) {
		return false;
	}

	if(stride < width*3) {
		stride = width*3;
	}

	std::string tmp;
	auto pSrcData = data;

	if(stride > width*3) {
		tmp.resize(width*height*3);
		for(int i = 0; i < height; ++i) {
			auto ppTmp = (char*)tmp.data() + i*width*3;
			auto ppSrc = (char*)data + i*stride;
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

bool EncodePngGray(
	std::string* dst, const char* pix,
	int width, int height, int stride
) {
	std::vector<uint8_t> rgb;
	grayToRGBVector(&rgb, (const uint8_t*)pix, width, height, stride);
	return EncodePng24(dst, (const char*)rgb.data(), width, height, stride);
}
bool EncodePngRGB(
	std::string* dst, const char* pix,
	int width, int height, int stride
) {
	return EncodePng24(dst, pix, width, height, stride);
}
bool EncodePngRGBA(
	std::string* dst, const char* pix,
	int width, int height, int stride
) {
	return EncodePng32(dst, pix, width, height, stride);
}

// --------------------------------------------------------

static bool DecodeJpeg_RGB(std::string* dst, const char* data, int size, int* width, int* height) {
	if(dst == NULL || data == NULL || size <= 0) {
		return false;
	}
	if(width == NULL || height == NULL) {
		return false;
	}

	int channels;
	auto p = jpgd::decompress_jpeg_image_from_memory(
		(const unsigned char *)data, size,
		width, height, &channels,
		3
	);
	if(p == NULL) {
		return false;
	}

	if(*width <= 0 || *height <= 0 || channels != 3) {
		free(p);
		return false;
	}

	dst->resize((*width)*(*height)*3);
	dst->assign((const char*)p, dst->size());
	free(p);

	return true;
}

static bool EncodeJpeg(
	std::string* dst, const char* data,
	int width, int height, int channels, int width_step /* =0 */,
	int quality /* =90 */
) {
	if(dst == NULL || data == NULL) {
		return false;
	}
	if(width <= 0 || height <= 0) {
		return false;
	}
	if(channels != 1 && channels != 3) {
		return false;
	}
	if(quality <= 0 || quality > 100) {
		return false;
	}

	if(width_step < width*channels) {
		width_step = width*channels;
	}

	std::string tmp;
	auto pSrcData = data;

	jpge::params comp_params;
	if(channels == 3) {
		comp_params.m_subsampling = jpge::H2V2;   // RGB
		comp_params.m_quality = quality;

		if(width_step > width*channels) {
			tmp.resize(width*height*3);
			for(int i = 0; i < height; ++i) {
				auto ppTmp = (char*)tmp.data() + i*width*channels;
				auto ppSrc = (char*)data + i*width_step;
				memcpy(ppTmp, ppSrc, width*channels);
			}
			pSrcData = tmp.data();
		}
	} else {
		comp_params.m_subsampling = jpge::Y_ONLY; // Gray
		comp_params.m_quality = quality;

		// if Gray: convert to RGB;
		tmp.resize(width*height*3);
		for(int i = 0; i < height; ++i) {
			auto ppTmp = (char*)tmp.data() + i*width*3;
			auto ppSrc = (char*)data + i*width_step;
			for(int j = 0; j < width; ++j) {
				ppTmp[i*3+0] = ppSrc[i];
				ppTmp[i*3+1] = ppSrc[i];
				ppTmp[i*3+2] = ppSrc[i];
			}
		}
		channels = 3;
		pSrcData = tmp.data();
	}

	int buf_size = ((width*height*3)>1024)? (width*height*3): 1024;
	dst->resize(buf_size);
	bool rv = compress_image_to_jpeg_file_in_memory(
		(void*)dst->data(), buf_size, width, height, channels,
		(const jpge::uint8*)pSrcData,
		comp_params
	);
	if(!rv) {
		dst->clear();
		return false;
	}

	dst->resize(buf_size);
	return true;
}

bool DecodeJpegGray(std::string* dst, const char* data, int size, int* width, int* height) {
	std::string s;
	if(!DecodeJpeg_RGB(&s, data, size, width, height)) {
		dst->clear();
		return false;
	}

	dst->resize(s.size()/3);

	auto pSrc = (const uint8_t*)s.data();
	auto pDst = (uint8_t*)dst->data();

	int k = 0;
	for(int i = 0; i < dst->size(); i++) {
		auto R = pSrc[k++];
		auto G = pSrc[k++];
		auto B = pSrc[k++];
		pDst[i] = (R+G+B)/3;
	}

	return true;
}
bool DecodeJpegRGB(std::string* dst, const char* data, int size, int* width, int* height) {
	return DecodeJpeg_RGB(dst, data, size, width, height);
}
bool DecodeJpegRGBA(std::string* dst, const char* data, int size, int* width, int* height) {
	std::string s;
	if(!DecodeJpeg_RGB(&s, data, size, width, height)) {
		dst->clear();
		return false;
	}

	dst->resize(s.size()*4/3);

	auto pSrc = (const uint8_t*)s.data();
	auto pDst = (uint8_t*)dst->data();

	int k = 0;
	for(int i = 0; i < s.size(); i += 3) {
		pDst[k++] = pSrc[i+0];
		pDst[k++] = pSrc[i+1];
		pDst[k++] = pSrc[i+2];
		k++;
	}

	return true;
}

bool EncodeJpegGray(
	std::string* dst, const char* pix,
	int width, int height, int stride, /* =0 */
	int quality /* =90 */
) {
	return EncodeJpeg(dst, pix, width, height, 1, stride, quality);
}
bool EncodeJpegRGB(
	std::string* dst, const char* pix,
	int width, int height, int stride, /* =0 */
	int quality /* =90 */
) {
	return EncodeJpeg(dst, pix, width, height, 3, stride, quality);
}
bool EncodeJpegRGBA(
	std::string* dst, const char* pix,
	int width, int height, int stride, /* =0 */
	int quality /* =90 */
) {
	std::vector<uint8_t> rgb;
	rgbaToRGBVector(&rgb, (const uint8_t*)pix, width, height, stride);
	return EncodeJpeg(dst, (const char*)rgb.data(), width, height, 3, 0, quality);
}

#endif // GUETZLI_BUILD_FOR_BROWSER

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------
