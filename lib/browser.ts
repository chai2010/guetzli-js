// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

//export * from "./cxx-emscripten/main"

import * as pkg from "./cxx-emscripten/main"

export const version: string = pkg.version

//export pkg.encodeGray
//export pkg.encodeRGB
//export pkg.encodeRGBA
