import { FrameType, VisualFrame } from ".";
export declare class VisualFrameRgb565 extends VisualFrame {
    readonly type: FrameType;
    get size(): number;
    toBytes: () => Uint8Array;
}
