import { AdditiveFrame } from ".";
import { FrameType } from "./frame";
export declare class AdditiveFrameRgb565 extends AdditiveFrame {
    readonly type: FrameType;
    get size(): number;
    toBytes: () => Uint8Array;
    static fromAdditiveFrame(frame: AdditiveFrame): AdditiveFrameRgb565;
}
