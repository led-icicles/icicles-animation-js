import { FrameType } from "./frame";
import { VisualFrame } from "./visual_frame";
export declare class VisualFrameRgb565 extends VisualFrame {
    readonly type: FrameType;
    get size(): number;
    toBytes: () => Uint8Array;
}
