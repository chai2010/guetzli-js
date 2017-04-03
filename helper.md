
## PNG helper (only for NodeJS)

### `decodePng24(data: Uint8Array): Image`

```js
const fs = require('fs')
const assert = require('assert')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng24(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 3) // RGB
assert(m.depth == 8)    // 3*8 = 24 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

### `decodePng32(data: Uint8Array): Image`

```js
const fs = require('fs')
const assert = require('assert')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng32(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 4) // RGBA
assert(m.depth == 8)    // 4*8 = 32 bit

let pix_size = m.width*m.height*m.channels*m.depth/8
assert(m.pix.length == pix_size)
```

### `encodePng24(pix:Uint8Array, width:number, height:number, stride:number): Uint8Array`

TODO

### `encodePng32(pix:Uint8Array, width:number, height:number, stride:number): Uint8Array`

TODO

