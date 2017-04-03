import * as image from './image';
export declare const version: string;
export declare const minQuality: number;
export declare const maxQuality: number;
export declare const defaultQuality: number;
export declare function encodeImage(m: image.Image, quality?: number): Uint8Array;
export declare function encodeGray(pix: Uint8Array, width: number, height: number, stride?: number, quality?: number): Uint8Array;
export declare function encodeRGB(pix: Uint8Array, width: number, height: number, stride?: number, quality?: number): Uint8Array;
export declare function encodeRGBA(pix: Uint8Array, width: number, height: number, stride?: number, quality?: number): Uint8Array;
