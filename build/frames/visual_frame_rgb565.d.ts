import { VisualFrame } from ".";
import { FrameType } from "./frame";
export declare class VisualFrameRgb565 extends VisualFrame {
    readonly type: FrameType;
    get size(): number;
    toBytes: () => Uint8Array;
    static fromVisualFrame(frame: VisualFrame): VisualFrameRgb565;
}
