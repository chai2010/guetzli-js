# hello-cxx

C++编写NodeJS模块(V7.3.3)

## 依赖工具(Windows环境):

- VC2015
- CMake 3.5+
- Node7-x64

## Node开发包

- http://nodejs.org/dist/v7.7.3/node-v7.7.3-headers.tar.gz
- http://nodejs.org/dist/v7.7.3/win-x64/node.lib
- http://nodejs.org/dist/v7.7.3/win-x64/node.exe


解压到 `./deps/node-v7.7.3-win64` 目录:

- `include/*.h`
- `lib/node.lib`
- `node.exe`


## 构建步骤

1. 进入当前命令行, 执行 `build-win64.bat`, 生成 `hello.dll`
2. 运行测试 `node index.js`

