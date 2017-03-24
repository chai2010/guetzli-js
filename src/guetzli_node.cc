// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include "guetzli_capi.h"

#include <node.h>
#include <node_buffer.h>
#include <node_object_wrap.h>

static void getVersion(const v8::FunctionCallbackInfo<v8::Value>& args) {
	args.GetReturnValue().Set(
		v8::String::NewFromUtf8(args.GetIsolate(), guetzli_getVersion())
	);
}

static void printBuffer(const v8::FunctionCallbackInfo<v8::Value>& args) {
	v8::Local<v8::Object> bufferObj = args[0]->ToObject();
	char* s = node::Buffer::Data(bufferObj);
	size_t n = node::Buffer::Length(bufferObj);
	printf("data: %s\n", s);
	printf("len: %d\n", n);
}

static void returnBuffer(const v8::FunctionCallbackInfo<v8::Value>& args) {
	v8::Isolate* isolate = args.GetIsolate();

	//char s[] = "hello";
	//v8::MaybeLocal<v8::Object> buf = node::Buffer::New(isolate, sizeof(s));
	//strcpy(node::Buffer::Data(buf), s

	//args.GetReturnValue().Set(buf);

	args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "TODO!"));
}

static void helloMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
	v8::Isolate* isolate = args.GetIsolate();
	args.GetReturnValue().Set(v8::String::NewFromUtf8(isolate, "hello, guetzli!"));
}

static void initModule(v8::Local<v8::Object> module) {
	NODE_SET_METHOD(module, "getVersion", getVersion);
	NODE_SET_METHOD(module, "printBuffer", printBuffer);
	NODE_SET_METHOD(module, "returnBuffer", returnBuffer);
	NODE_SET_METHOD(module, "hello", helloMethod);
}

NODE_MODULE(guetzli, initModule);
