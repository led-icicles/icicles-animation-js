export declare enum FrameType {
    DelayFrame = 1,
    VisualFrame = 2,
    AdditiveFrame = 3,
    VisualFrameRgb565 = 12,
    AdditiveFrameRgb565 = 13
}
export declare abstract class Frame {
    readonly duration: number;
    static readonly maxDuration: number;
    abstract readonly type: FrameType;
    constructor(duration: number);
    abstract get size(): number;
    abstract toBytes(): Uint8Array;
}
