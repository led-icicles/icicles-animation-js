/// <reference types="node" />
export declare const NEWEST_ANIMATION_VERSION: number;
export declare const MIN_ANIMATION_VERSION: number;
export interface AnimationHeaderData {
    readonly name: string;
    readonly xCount: number;
    readonly yCount: number;
    readonly loopsCount?: number;
    readonly versionNumber?: number;
}
export declare class AnimationHeader implements AnimationHeaderData {
    /**  **uint16** max number: `65535` */
    readonly versionNumber: number;
    /** utf-8 animation name */
    readonly name: string;
    /**  **uint8** max number: `255` */
    readonly xCount: number;
    /**  **uint8** max number: `255` */
    readonly yCount: number;
    /**  **uint16** max number: `65535`
     * 0 - infinite (or device maximum loop iterations - if defined)
     * 1 - is a default value
     */
    readonly loopsCount: number;
    get pixelsCount(): number;
    constructor({ xCount, yCount, versionNumber: version, name, loopsCount: loops, }: AnimationHeaderData);
    get ledsCount(): number;
    get size(): number;
    static readonly isLittleEndian: boolean;
    private _getEncodedAnimationNameV2;
    encode: () => Uint8Array;
    static decode: (buffer: Buffer) => {
        header: AnimationHeader;
        data: Uint8Array;
    };
}
