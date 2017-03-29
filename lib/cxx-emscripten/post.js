// Copyright 2017 ChaiShushan <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// browser: export Module
if(ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
	if(module['exports'] !== Module) {
		module['exports'] = Module
	}
}
