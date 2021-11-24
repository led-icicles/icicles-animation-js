/// <reference types="node" />
export declare const NEWEST_ANIMATION_VERSION: number;
export declare const MIN_ANIMATION_VERSION: number;
export interface AnimationHeaderData {
    readonly name: string;
    readonly xCount: number;
    readonly yCount: number;
    readonly loopsCount?: number;
    readonly versionNumber?: number;
    readonly radioPanelsCount?: number;
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
     *
     * `0` - infinite (or device maximum loop iterations - if defined)
     *
     * `1` - is a default value
     */
    readonly loopsCount: number;
    /**  **uint8** max number: `255`
     *
     * `0` - Animation does not support radio panels. All functionality will be disabled.
     *     if panels are present, they will play inline animations.
     *
     * `1-255` - The radio panels will turn black at the start of the animation and wait for instructions.
     */
    readonly radioPanelsCount: number;
    get pixelsCount(): number;
    constructor({ xCount, yCount, versionNumber: version, name, loopsCount: loops, radioPanelsCount, }: AnimationHeaderData);
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
