import { IndexedColor } from "../utils/color";
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
    get size565(): number;
    toBytes: ({ rgb565, }?: {
        rgb565?: boolean | undefined;
    }) => Uint8Array;
}
