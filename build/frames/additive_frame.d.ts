import { IndexedColor } from "../utils/color";
import { AdditiveFrameRgb565 } from "./additive_frame_rgb565";
import { Frame, FrameType } from "./frame";
import { VisualFrame } from "./visual_frame";
export declare class AdditiveFrame extends Frame {
    readonly changedPixels: Array<IndexedColor>;
    readonly duration: number;
    readonly type: FrameType;
    static readonly maxChangedPixelIndex: number;
    constructor(changedPixels: Array<IndexedColor>, duration: number);
    static getChangedPixelsFromFrames: (prevFrame: VisualFrame, nextFrame: VisualFrame) => Array<IndexedColor>;
    mergeOnto(frame: VisualFrame): VisualFrame;
    static fromVisualFrames: (prevFrame: VisualFrame, nextFrame: VisualFrame) => AdditiveFrame;
    get size(): number;
    toRgb565(): AdditiveFrameRgb565;
    toBytes: () => Uint8Array;
}
