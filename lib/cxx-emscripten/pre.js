// Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Module;
if (!Module) Module = (typeof Module !== 'undefined' ? Module : null) || {};

if(!Module.TOTAL_STACK) {
	Module.TOTAL_STACK = 5*1024*1024;   // 5 MB
}
if(!Module.TOTAL_MEMORY) {
	Module.TOTAL_MEMORY = 64*1024*1024; // 64 MB
}
if(!Module.ALLOW_MEMORY_GROWTH) {
	Module.ALLOW_MEMORY_GROWTH = true;
}

if(!Module.SIMD) {
	Module.SIMD = false;
}
