// Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "bmp.h"

#include <stdio.h>

struct FileHeader {
	char type1;
	char type2;
};

struct InfoHeader {
	unsigned int   imageSize;
	unsigned int   blank;
	unsigned int   startPosition;
	unsigned int   length;
	unsigned int   width;
	unsigned int   height;
	unsigned short colorPlane;
	unsigned short bitColor;
	unsigned int   zipFormat;
	unsigned int   realSize;
	unsigned int   xPels;
	unsigned int   yPels;
	unsigned int   colorUse;
	unsigned int   colorImportant;
};

struct RGBA {
	unsigned char B;
	unsigned char G;
	unsigned char R;
	unsigned char A;
};

bool bmpDecode(
	std::string* dst, const char* data, int size,
	int* width, int* height, int* channels
) {
	if(dst == NULL) {
		return false;
	}
	if(data == NULL || size <= sizeof(FileHeader)+sizeof(InfoHeader)) {
		return false;
	}
	if(width == NULL || height == NULL || channels == NULL) {
		return false;
	}

	FileHeader hdr;
	memcpy(&hdr, data, sizeof(FileHeader));

	if((hdr.type1 != 'B' && hdr.type1 != 'b') || (hdr.type2 != 'M' && hdr.type2 != 'm')) {
		return false;
	}

	InfoHeader info;
	memcpy(&info, data+sizeof(FileHeader), sizeof(InfoHeader));

	int nColors = info.bitColor/8;
	if(nColors != 1 && nColors != 3) {
		return false;
	}
	if(info.width <= 0 || info.height <=0) {
		return false;
	}

	int modbytes = (info.width*nColors)%4;
	int stride = modbytes? ((info.width*nColors)-modbytes+4): (info.width*nColors);

	if(size <= sizeof(FileHeader)+sizeof(InfoHeader)+info.height*stride) {
		return false;
	}

	dst->resize(info.width*info.height*nColors);
	for(int i = 0; i < info.height; i++) {
		int nSrcStride = stride;
		int nDstStride = info.width*nColors;

		char* pSrc = data + i*nSrcStride;
		char* pDst = dst->data() + (info.height-i-1)*nDstStride;

		memcpy(pDst, pSrc, nDstStride);
	}

	// OK
	*width = info.width;
	*height = info.height;
	*channels = nColors;
	return true;
}

bool bmpEncode(
	std::string* dst, const char* pix,
	int width, int height, int stride,
	int channels
) {
	if(dst == NULL || pix == NULL) {
		return false;
	}
	if(width <= 0 || height <= 0 || channels <= 0) {
		return false;
	}
	if(channels != 1 && channels != 3) {
		return false;
	}

	if(stride == 0) {
		stride = width*channels;
	}
	if(stride < width*channels) {
		return false;
	}

	int modbytes = (width*channels)%4;
	int step = modbytes? ((width*channels)-modbytes+4): (width*channels);

	FileHeader hdr;
	memset(&hdr, 0, sizeof(hdr));

	InfoHeader info;
	memset(&info, 0, sizeof(info));

	RGBA rgba;
	memset(&rgba, 0, sizeof(rgba));

	hdr.type1='B';
	hdr.type2='M';

	const int hdrSize = sizeof(FileHeader) + sizeof(InfoHeader);
	const int palettedSize = 256*4; // 1024

	info.imageSize = hdrSize + height*step + ((channels==1)? palettedSize: 0);
	info.startPosition = (channels==3)? hdrSize: hdrSize+palettedSize;
	info.length = 40;
	info.width = width;
	info.height = height;
	info.colorPlane = 1;
	info.bitColor = (channels==3)? 24: 8;
	info.realSize = (height*step);

	dst->resize(info.imageSize);
	char *p = dst->data();

	memcpy(p, &hdr, sizeof(hdr));
	p += sizeof(hdr);

	memcpy(p, &info, sizeof(info));
	p += sizeof(info);

	if(channels == 1) {
		for(int i = 0; i < 256; i++) {
			rgba.R = i;
			rgba.G = i;
			rgba.B = i;
			rgba.A = 0;

			memcpy(p, &rgba, sizeof(rgba));
			p += sizeof(rgba);
		}
	}

	char* pDstData = p;
	for(int i = 0; i < height; i++) {
		int nSrcStride = stride;
		int nDstStride = width*nColors;

		char* pSrc = pix + i*nSrcStride;
		char* pDst = pDstData + (height-i-1)*nDstStride;

		memcpy(pDst, pSrc, nDstStride);
	}

	return true;
}

