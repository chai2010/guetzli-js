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
export declare function encodeGray(pix: Uint8Array, w: number, h: number, stride: number, quality: number): Uint8Array;
export declare function encodeRGB(pix: Uint8Array, w: number, h: number, stride: number, quality: number): Uint8Array;
export declare function encodeRGBA(pix: Uint8Array, w: number, h: number, stride: number, quality: number): Uint8Array;
