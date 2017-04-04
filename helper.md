
## PNG helper (only for NodeJS)

### `decodePng(data: Uint8Array, expect_channels: number = 4): Image`

```js
const fs = require('fs')
const assert = require('assert')

let data = fs.readFileSync('./testdata/bees.png')
let m = guetzli.decodePng(data)

assert(m.width == 444)
assert(m.height == 258)
assert(m.channels == 4) // RGBA
```


### `encodePng(pix:Uint8Array, width:number, height:number, channels:number, stride:number): Uint8Array`

TODO


