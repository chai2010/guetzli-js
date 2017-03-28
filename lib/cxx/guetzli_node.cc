// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "guetzli_api.h"

#include <node.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

#include <stdio.h>

// ----------------------------------------------------------------------------
// guetzli api
// ----------------------------------------------------------------------------

static void getVersion(const v8::FunctionCallbackInfo<v8::Value>& args) {
	args.GetReturnValue().Set(
		v8::String::NewFromUtf8(args.GetIsolate(), guetzliGetVersion())
	);
}

// function encodeXXX(pix, width, height, stride, quality) -> Buffer;
static bool checkEncodeArgsOrThrowException(
	v8::Isolate* isolate,
	const v8::FunctionCallbackInfo<v8::Value>& args
) {
	if(args.Length() != 5) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate,
				"function(buffer, width, height, stride, quality) -> Buffer\n"
				"Wrong number of arguments!\n"
			)
		));
		return false;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate,
				"function(buffer, width, height, stride, quality) -> Buffer\n"
				"args0 must be buffer type!\n"
			)
		));
		return false;
	}

	for(int i = 1; i < 5; i++) {
		if(!args[i]->IsNumber()) {
			char sbuf[64];
			snprintf(sbuf, sizeof(sbuf)-1,
				"function(buffer, width, height, stride, quality) -> Buffer\n"
				"args%d must be number type!\n",
				i
			);
			isolate->ThrowException(v8::Exception::TypeError(
				v8::String::NewFromUtf8(isolate, sbuf)
			));
			return false;
		}
	}

	return true;
}

static void encodeGray(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if(!checkEncodeArgsOrThrowException(isolate, args)) {
		return;
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto stride = int(args[3]->NumberValue());
	auto quality = float(args[4]->NumberValue());

	std::string output;
	if (!guetzliEncodeGray(pix, width, height, stride, quality, &output)) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate, "guetzliEncodeGray failed!")
		));
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
}

static void encodeRGB(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if (!checkEncodeArgsOrThrowException(isolate, args)) {
		return;
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto stride = int(args[3]->NumberValue());
	auto quality = float(args[4]->NumberValue());

	std::string output;
	if (!guetzliEncodeRGB(pix, width, height, stride, quality, &output)) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate, "guetzliEncodeRGB failed!")
		));
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
}

static void encodeRGBA(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if (!checkEncodeArgsOrThrowException(isolate, args)) {
		return;
	}

	auto pix = (const uint8_t*)(node::Buffer::Data(args[0]->ToObject()));
	auto width = int(args[1]->NumberValue());
	auto height = int(args[2]->NumberValue());
	auto stride = int(args[3]->NumberValue());
	auto quality = float(args[4]->NumberValue());

	std::string output;
	if (!guetzliEncodeRGBA(pix, width, height, stride, quality, &output)) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate, "guetzliEncodeRGBA failed!")
		));
		return;
	}

	auto result = node::Buffer::Copy(isolate, output.data(), output.size());
	args.GetReturnValue().Set(result.ToLocalChecked());
}

// ----------------------------------------------------------------------------
// PNG helper
// ----------------------------------------------------------------------------

// function DecodePng(data) -> {pix, width, height, channels, depth};
static bool checkDecodePngArgsOrThrowException(
	v8::Isolate* isolate,
	const v8::FunctionCallbackInfo<v8::Value>& args
) {
	if(args.Length() != 1) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate,
				"function(data) -> {pix, width, height, channels, depth}\n"
				"Wrong number of arguments!\n"
			)
		));
		return false;
	}

	if(!args[0]->IsObject() || !node::Buffer::HasInstance(args[0]->ToObject())) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate,
				"function(data) -> {pix, width, height, channels, depth}\n"
				"args0 must be buffer type!\n"
			)
		));
		return false;
	}

	return true;
}

static void decodePng32(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if (!checkDecodePngArgsOrThrowException(isolate, args)) {
		return;
	}

	auto arg0 = args[0]->ToObject();
	auto data = (const char*)(node::Buffer::Data(arg0));
	auto size = int(node::Buffer::Length(arg0));

	int width, height;
	std::string output;
	if(!DecodePng32(&output, data, size, &width, &height)) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate, "DecodePng32 failed!")
		));
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
		v8::Number::New(isolate, 4)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "depth"),
		v8::Number::New(isolate, 8)
	);
	
	args.GetReturnValue().Set(result);
}

static void decodePng24(const v8::FunctionCallbackInfo<v8::Value>& args) {
	auto isolate = args.GetIsolate();

	if (!checkDecodePngArgsOrThrowException(isolate, args)) {
		return;
	}

	auto arg0 = args[0]->ToObject();
	auto data = (const char*)(node::Buffer::Data(arg0));
	auto size = int(node::Buffer::Length(arg0));

	int width, height;
	std::string output;
	if(!DecodePng24(&output, data, size, &width, &height)) {
		isolate->ThrowException(v8::Exception::TypeError(
			v8::String::NewFromUtf8(isolate, "DecodePng24 failed!")
		));
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
		v8::Number::New(isolate, 3)
	);
	result->Set(v8::Local<v8::Context>(),
		v8::String::NewFromUtf8(isolate, "depth"),
		v8::Number::New(isolate, 8)
	);
	
	args.GetReturnValue().Set(result);
}

// ----------------------------------------------------------------------------
// NodeJS Module
// ----------------------------------------------------------------------------

static void initModule(v8::Local<v8::Object> module) {
	NODE_SET_METHOD(module, "getVersion", getVersion);

	NODE_SET_METHOD(module, "encodeGray", encodeGray);
	NODE_SET_METHOD(module, "encodeRGB", encodeRGB);
	NODE_SET_METHOD(module, "encodeRGBA", encodeRGBA);

	NODE_SET_METHOD(module, "decodePng24", decodePng24);
	NODE_SET_METHOD(module, "decodePng32", decodePng32);
}

NODE_MODULE(guetzli, initModule);

// ----------------------------------------------------------------------------
// END
// ----------------------------------------------------------------------------
