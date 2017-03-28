// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

#include <guetzli_api.h>

#include <emscripten.h>
#include <stdio.h>

static auto preMain = emscripten_run_script_int(R"==(
	// disable auto run main
	Module.noInitialRun = true;
	shouldRunNow = false;
)==");

int main() {
	printf("hello guetzli!\n");
	return 0;
}
