export declare const version: string;
export declare const minQuality: number;
export declare const maxQuality: number;
export declare const defaultQuality: number;
export interface Image {
    width: number;
    height: number;
    channels: number;
    depth: number;
    stride: number;
    pix: Uint8Array;
}
export declare function encodeImage(m: Image, quality?: number): Uint8Array;
export declare function encodeGray(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array;
export declare function encodeRGB(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array;
export declare function encodeRGBA(pix: Uint8Array, width: number, height: number, stride: number, quality: number): Uint8Array;
export declare function decodePng24(data: Uint8Array): Image;
export declare function decodePng32(data: Uint8Array): Image;
export declare function encodePng24(pix: Uint8Array, width: number, height: number, stride: number): Uint8Array;
export declare function encodePng32(pix: Uint8Array, width: number, height: number, stride: number): Uint8Array;
