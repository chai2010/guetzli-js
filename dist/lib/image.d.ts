export interface Image {
    width: number;
    height: number;
    channels: number;
    stride?: number;
    pix: Uint8Array;
}
export declare function colorAt(m: Image, x: number, y: number, iChannel: number): number;
