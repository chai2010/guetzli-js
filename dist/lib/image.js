// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
"use strict";
exports.__esModule = true;
function colorAt(m, x, y, iChannel) {
    if (iChannel >= m.channels) {
        return 0;
    }
    var stride = m.width * m.channels;
    if (m.stride && m.stride > 0) {
        stride = m.stride;
    }
    var off = y * stride + x * m.channels + iChannel;
    return m.pix[off];
}
exports.colorAt = colorAt;
