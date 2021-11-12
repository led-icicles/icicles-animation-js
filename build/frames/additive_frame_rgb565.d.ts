import { AdditiveFrame, FrameType } from ".";
export declare class AdditiveFrameRgb565 extends AdditiveFrame {
    readonly type: FrameType;
    get size(): number;
    toBytes: () => Uint8Array;
}
