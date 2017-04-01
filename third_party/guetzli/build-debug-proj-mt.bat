:: Copyright 2013 <chaishushan{AT}gmail.com>. All rights reserved.
:: Use of this source code is governed by a BSD-style
:: license that can be found in the LICENSE file.

:: ----------------------------------------------------------------------------
:: Setup MSVC

:: VS2015
if not "x%VS140COMNTOOLS%" == "x" (
	echo Setup VS2015 Win64 ...
	call "%VS140COMNTOOLS%\..\..\VC\vcvarsall.bat" x86_amd64
	goto build
)

:build

:: -----------------------------------------------------------------------------
:: build app

mkdir zz_build_debug_proj_mt_tmp
cd    zz_build_debug_proj_mt_tmp

cmake ..^
  -G "Visual Studio 14 2015 Win64"^
  -DCMAKE_BUILD_TYPE=debug^
  -DCMAKE_INSTALL_PREFIX=..^
  ^
  -DCMAKE_MODULE_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_SHARED_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_STATIC_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_EXE_LINKER_FLAGS="/MACHINE:x64"


:: -----------------------------------------------------------------------------
cd ..
