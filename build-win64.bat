:: Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
:: Use of this source code is governed by a BSD-style
:: license that can be found in the LICENSE file.

setlocal

cd %~dp0

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
:: BUG: http://public.kitware.com/Bug/bug_relationship_graph.php?bug_id=14693&graph=relation

mkdir zz_build_win64_release
cd    zz_build_win64_release

cmake ..^
  -G "NMake Makefiles"^
  -DCMAKE_INSTALL_PREFIX=..^
  -DCMAKE_BUILD_TYPE=release^
  ^
  -DCMAKE_MODULE_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_SHARED_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_STATIC_LINKER_FLAGS="/machine:x64"^
  -DCMAKE_EXE_LINKER_FLAGS="/MACHINE:x64"

nmake install

:: -----------------------------------------------------------------------------
:end

