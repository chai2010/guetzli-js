// Copyright 2017 <chaishushan{AT}gmail.com>. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Module

export function print(str: string): void;
export function printErr(str: string): void;

export let preInit: { ():  void }[];
export let preRun: { ():  void }[];
export let postRun: { ():  void }[];
export let noExitRuntime: boolean;

export let Runtime: any;

export function ccall(ident: string, returnType: string, argTypes: string[], args: any[]): any;
export function cwrap(ident: string, returnType: string, argTypes: string[]): any;

export function setValue(ptr: number, value: any, type: string, noSafe?: boolean): void;
export function getValue(ptr: number, type: string, noSafe?: boolean): number;

export let ALLOC_NORMAL: number;
export let ALLOC_STACK: number;
export let ALLOC_STATIC: number;
export let ALLOC_DYNAMIC: number;
export let ALLOC_NONE: number;

export function allocate(slab: any, types: string, allocator: number, ptr: number): number;
export function allocate(slab: any, types: string[], allocator: number, ptr: number): number;

export function Pointer_stringify(ptr: number, length?: number): string;
export function UTF16ToString(ptr: number): string;
export function stringToUTF16(str: string, outPtr: number): void;
export function UTF32ToString(ptr: number): string;
export function stringToUTF32(str: string, outPtr: number): void;

// USE_TYPED_ARRAYS == 1
export let HEAP: Int32Array;
export let IHEAP: Int32Array;
export let FHEAP: Float64Array;

// USE_TYPED_ARRAYS == 2
export let HEAP8: Int8Array;
export let HEAP16: Int16Array;
export let HEAP32: Int32Array;
export let HEAPU8:  Uint8Array;
export let HEAPU16: Uint16Array;
export let HEAPU32: Uint32Array;
export let HEAPF32: Float32Array;
export let HEAPF64: Float64Array;

export let TOTAL_STACK: number;
export let TOTAL_MEMORY: number;
export let FAST_MEMORY: number;

export function addOnPreRun(cb: () => any): void;
export function addOnInit(cb: () => any): void;
export function addOnPreMain(cb: () => any): void;
export function addOnExit(cb: () => any): void;
export function addOnPostRun(cb: () => any): void;

// Tools
export function intArrayFromString(stringy: string, dontAddNull?: boolean, length?: number): number[];
export function intArrayToString(array: number[]): string;
export function writeStringToMemory(str: string, buffer: number, dontAddNull: boolean): void;
export function writeArrayToMemory(array: number[], buffer: number): void;
export function writeAsciiToMemory(str: string, buffer: number, dontAddNull: boolean): void;

export function addRunDependency(id: any): void;
export function removeRunDependency(id: any): void;


export let preloadedImages: any;
export let preloadedAudios: any;

export function _malloc(size: number): number;
export function _free(ptr: number): void;

// guetzli api

export const version: string;

export const minQuality: number;
export const maxQuality: number;
export const defaultQuality: number;

export interface Image {
	width:    number;
	height:   number;
	channels: number;
	stride?:  number;
	pix:      Uint8Array;
}

export function encodeImage(m: Image, quality?:number): Uint8Array;

export function encodeGray(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array;
export function encodeRGB(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array;
export function encodeRGBA(pix:Uint8Array, w:number, h:number, stride:number, quality:number): Uint8Array;

