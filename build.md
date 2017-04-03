
### Build `guetzli.node` with CMake

**Windows x64**

- Install CMake 3.5+
- Install VS2015
- run `build-win64.bat` in command line

**Windows x86**

- Install CMake 3.5+
- Install VS2015
- run `build-win32.bat` in command line

**Darwin or Linux**

- Install CMake 3.5+
- Install GCC
- `mkdir build`
- `cd build && cmake .. && make install`

### Build `lib/cxx-emscripten/guetzli.out.js` with Emscripten

- Install Emscripten
- `make`
