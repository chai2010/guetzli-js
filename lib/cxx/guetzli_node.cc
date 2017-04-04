// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "guetzli_api.h"

#include <node.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

#include <stdarg.h>
#include <stddef.h>
#include <stdio.h>

// ----------------------------------------------------------------------------
// stringprintf
// ----------------------------------------------------------------------------

#ifdef _MSC_VER
enum { IS_COMPILER_MSVC = 1 };
#ifndef va_copy
// Define va_copy for MSVC. This is a hack, assuming va_list is simply a
// pointer into the stack and is safe to copy.
#define va_copy(dest, src) ((dest) = (src))
#endif
#else
enum { IS_COMPILER_MSVC = 0 };
#endif

static void StringAppendV(std::string* dst, const char* format, va_list ap) {
	// First try with a small fixed size buffer
	static const int kSpaceLength = 1024;
	char space[kSpaceLength];

	// It's possible for methods that use a va_list to invalidate
	// the data in it upon use.  The fix is to make a copy
	// of the structure before using it and use that copy instead.
	va_list backup_ap;
	va_copy(backup_ap, ap);
	int result = vsnprintf(space, kSpaceLength, format, backup_ap);
	va_end(backup_ap);

	if (result < kSpaceLength) {
		if (result >= 0) {
			// Normal case -- everything fit.
			dst->append(space, result);
			return;
		}

		if (IS_COMPILER_MSVC) {
			// Error or MSVC running out of space.  MSVC 8.0 and higher
			// can be asked about space needed with the special idiom below:
			va_copy(backup_ap, ap);
			result = vsnprintf(NULL, 0, format, backup_ap);
			va_end(backup_ap);
		}

		if (result < 0) {
			// Just an error.
			return;
		}
	}

	// Increase the buffer size to the size requested by vsnprintf,
	// plus one for the closing \0.
	int length = result+1;
	char* buf = new char[length];

	// Restore the va_list before we use it again
	va_copy(backup_ap, ap);
	result = vsnprintf(buf, length, format, backup_ap);
	va_end(backup_ap);

	if (result >= 0 && result < length) {
		// It fit
		dst->append(buf, result);
	}
	delete[] buf;
}

static std::string StringPrintf(const char* format, ...) {
	va_list ap;
	va_start(ap, format);
	std::string result;
	StringAppendV(&result, format, ap);
	va_end(ap);
	return result;
}

static const std::string& SStringPrintf(std::string* dst, const char* format, ...) {
	va_list ap;
	va_start(ap, format);
	dst->clear();
	StringAppendV(dst, format, ap);
	va_end(ap);
	return *dst;
}

static void StringAppendF(std::string* dst, const char* format, ...) {
	va_list ap;
	va_start(ap, format);
	StringAppendV(dst, format, ap);
	va_end(ap);
}

// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------

static void v8ThrowException(v8::Isolate *isolate, const char* format, ...) {
	va_list ap;
	va_start(ap, format);
	std::string msg;
	StringAppendV(&msg, format, ap);
	va_end(ap);

	isolate->ThrowException(v8::Exception::TypeError(
		v8::String::NewFromUtf8(isolate, msg.c_str())
	));
}

static void getVersion(const v8::FunctionCallbackInfo<v8::Value>& args) {
	args.GetReturnValue().Set(
		v8::String::NewFromUtf8(args.GetIsolate(), guetzliGetVersion())
	);
}

// function(buffer, width, height, channels, stride, quality) -> Buffer
static void encodeImage(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(args.Length() != 6) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"Wrong number of arguments!\n"
		);
		return;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"args[0] must be buffer type!\n"
		);
		return;
	}

	for(int i = 1; i < 6; i++) {
		if(!args[i]->IsNumber()) {
			v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
				"args[%d] must be number type!\n",
				i
			);
			return;
		}
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto channels = int(args[3]->NumberValue());
	auto stride = int(args[4]->NumberValue());
	auto quality = float(args[5]->NumberValue());

	if(pix == NULL) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"invalid pix: NULL!\n",
			channels
		);
		return;
	}
	if(width <= 0 || height <= 0) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"invalid image size: %dx%d!\n",
			width, height
		);
		return;
	}
	if(channels != 1 && channels != 3 && channels != 4) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"invalid channels: %d, expect 1/3/4!\n",
			channels
		);
		return;
	}
	if(stride != 0 && stride < width*channels) {
		v8ThrowException(isolate,
			"function(buffer, width, height, channels, stride, quality) -> Buffer\n"
			"invalid stride: %d, expect 0 or width*channels!\n",
			stride
		);
		return;
	}

	if(quality < kGuetzliMinQuality) {
		quality = kGuetzliMinQuality;
	}
	if(quality > kGuetzliMaxQuality) {
		quality = kGuetzliMaxQuality;
	}

	bool rv = false;
	std::string output;
	switch(channels) {
	case 1:
		rv = guetzliEncodeGray(pix, width, height, stride, quality, &output);
		break;
	case 3:
		rv = guetzliEncodeRGB(pix, width, height, stride, quality, &output);
		break;
	case 4:
		rv = guetzliEncodeRGBA(pix, width, height, stride, quality, &output);
		break;
	}
	if(!rv) {
		v8ThrowException(isolate, "c++: encodeImage failed!");
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
	return;
}

// ----------------------------------------------------------------------------
// PNG helper
// ----------------------------------------------------------------------------

// function(data, expect_channels) -> {pix, width, height, channels, depth};
static void decodePng(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(args.Length() != 2) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"Wrong number of arguments!\n"
		);
		return;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"args[0] must be buffer type!\n"
		);
		return;
	}

	auto arg0 = args[0]->ToObject();
	auto data = (const char*)(node::Buffer::Data(arg0));
	auto size = int(node::Buffer::Length(arg0));
	auto expect_channels = int(args[1]->NumberValue());

	if(data == NULL) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"invalid data: NULL!\n"
		);
		return;
	}
	if(expect_channels != 1 && expect_channels != 3 && expect_channels != 4) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"invalid expect_channels: %d, expect 3/4!\n",
			expect_channels
		);
		return;
	}

	bool rv = false;
	int width, height;
	std::string output;
	switch(expect_channels) {
	case 1:
		rv = DecodePngGray(&output, data, size, &width, &height);
		break;
	case 3:
		rv = DecodePngRGB(&output, data, size, &width, &height);
		break;
	case 4:
		rv = DecodePngRGBA(&output, data, size, &width, &height);
		break;
	}
	if(!rv) {
		v8ThrowException(isolate, "c++: decodePng failed!");
		return;
	}

	v8::Local<v8::Object> result = v8::Object::New(isolate);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "pix"),
		node::Buffer::Copy(isolate, output.data(), output.size()).ToLocalChecked()
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "width"),
		v8::Number::New(isolate, width)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "height"),
		v8::Number::New(isolate, height)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "channels"),
		v8::Number::New(isolate, expect_channels)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "depth"),
		v8::Number::New(isolate, 8)
	);

	args.GetReturnValue().Set(result);
	return;
}

// function(pix, width, height, channels, stride) -> Buffer
static void encodePng(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(args.Length() != 5) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"Wrong number of arguments!\n"
		);
		return;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"args[0] must be buffer type!\n"
		);
		return;
	}

	for(int i = 1; i < 5; i++) {
		if(!args[i]->IsNumber()) {
			v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
				"args[%d] must be number type!\n",
				i
			);
			return;
		}
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto channels = int(args[3]->NumberValue());
	auto stride = int(args[4]->NumberValue());

	if(pix == NULL) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"invalid pix: NULL!\n",
			channels
		);
		return;
	}
	if(width <= 0 || height <= 0) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"invalid image size: %dx%d!\n",
			width, height
		);
		return;
	}
	if(channels != 1 && channels != 3 && channels != 4) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"invalid channels: %d, expect 3/4!\n",
			channels
		);
		return;
	}
	if(stride != 0 && stride < width*channels) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride) -> Buffer\n"
			"invalid stride: %d, expect 0 or width*channels!\n",
			stride
		);
		return;
	}

	bool rv = false;
	std::string output;
	switch(channels) {
	case 1:
		rv = EncodePngGray(&output, (const char*)pix, width, height, stride);
		break;
	case 3:
		rv = EncodePngRGB(&output, (const char*)pix, width, height, stride);
		break;
	case 4:
		rv = EncodePngRGBA(&output, (const char*)pix, width, height, stride);
		break;
	}
	if(!rv) {
		v8ThrowException(isolate, "c++: encodePng failed!");
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
	return;
}

// ----------------------------------------------------------------------------
// JPEG helper
// ----------------------------------------------------------------------------

// function(data, expect_channels) -> {pix, width, height, channels, depth};
static void decodeJpg(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(args.Length() != 2) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"Wrong number of arguments!\n"
		);
		return;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"args[0] must be buffer type!\n"
		);
		return;
	}

	auto arg0 = args[0]->ToObject();
	auto data = (const char*)(node::Buffer::Data(arg0));
	auto size = int(node::Buffer::Length(arg0));
	auto expect_channels = int(args[1]->NumberValue());

	if(data == NULL) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"invalid data: NULL!\n"
		);
		return;
	}
	if(expect_channels != 1 && expect_channels != 3 && expect_channels != 4) {
		v8ThrowException(isolate,
			"function(data, expect_channels) -> {pix, width, height, channels, depth}\n"
			"invalid expect_channels: %d, expect 3/4!\n",
			expect_channels
		);
		return;
	}

	bool rv = false;
	int width, height;
	std::string output;
	switch(expect_channels) {
	case 1:
		rv = DecodeJpegGray(&output, data, size, &width, &height);
		break;
	case 3:
		rv = DecodeJpegRGB(&output, data, size, &width, &height);
		break;
	case 4:
		rv = DecodeJpegRGBA(&output, data, size, &width, &height);
		break;
	}
	if(!rv) {
		v8ThrowException(isolate, "c++: decodeJpg failed!");
		return;
	}

	v8::Local<v8::Object> result = v8::Object::New(isolate);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "pix"),
		node::Buffer::Copy(isolate, output.data(), output.size()).ToLocalChecked()
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "width"),
		v8::Number::New(isolate, width)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "height"),
		v8::Number::New(isolate, height)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "channels"),
		v8::Number::New(isolate, expect_channels)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "depth"),
		v8::Number::New(isolate, 8)
	);

	args.GetReturnValue().Set(result);
	return;
}

// function(pix, width, height, channels, stride, quality) -> Buffer
static void encodeJpg(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(args.Length() != 6) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"Wrong number of arguments!\n"
		);
		return;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"args[0] must be buffer type!\n"
		);
		return;
	}

	for(int i = 1; i < 6; i++) {
		if(!args[i]->IsNumber()) {
			v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
				"args[%d] must be number type!\n",
				i
			);
			return;
		}
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto channels = int(args[3]->NumberValue());
	auto stride = int(args[4]->NumberValue());
	auto quality = int(args[5]->NumberValue());

	if(pix == NULL) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"invalid pix: NULL!\n",
			channels
		);
		return;
	}
	if(width <= 0 || height <= 0) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"invalid image size: %dx%d!\n",
			width, height
		);
		return;
	}
	if(channels != 1 && channels != 3 && channels != 4) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"invalid channels: %d, expect 1/3/4!\n",
			channels
		);
		return;
	}
	if(stride != 0 && stride < width*channels) {
		v8ThrowException(isolate,
			"function(pix, width, height, channels, stride, quality) -> Buffer\n"
			"invalid stride: %d, expect 0 or width*channels!\n",
			stride
		);
		return;
	}

	bool rv = false;
	std::string output;
	switch(channels) {
	case 1:
		rv = EncodeJpegGray(&output, (const char*)pix, width, height, stride, quality);
		break;
	case 3:
		rv = EncodeJpegRGB(&output, (const char*)pix, width, height, stride, quality);
		break;
	case 4:
		rv = EncodeJpegRGBA(&output, (const char*)pix, width, height, stride, quality);
		break;
	}
	if(!rv) {
		v8ThrowException(isolate, "c++: encodeJpg failed!");
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
	return;
}

// ----------------------------------------------------------------------------
// NodeJS Module
// ----------------------------------------------------------------------------

static void initModule(v8::Local<v8::Object> module) {
	NODE_SET_METHOD(module, "getVersion", getVersion);

	NODE_SET_METHOD(module, "encodeImage", encodeImage);

	NODE_SET_METHOD(module, "decodeJpg", decodeJpg);
	NODE_SET_METHOD(module, "encodeJpg", encodeJpg);

	NODE_SET_METHOD(module, "decodePng", decodePng);
	NODE_SET_METHOD(module, "encodePng", encodePng);
}

NODE_MODULE(guetzli, initModule);

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------
