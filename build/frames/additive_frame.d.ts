import { IndexedColor } from "../color";
import { Frame, FrameType } from "./frame";
import VisualFrame from "./visual_frame";
export default class AdditiveFrame extends Frame {
    readonly changedPixels: Array<IndexedColor>;
    readonly duration: number;
    readonly type: FrameType;
    static readonly maxChangedPixelIndex: number;
    constructor(changedPixels: Array<IndexedColor>, duration: number);
    static getChangedPixelsFromFrames: (prevFrame: VisualFrame, nextFrame: VisualFrame) => Array<IndexedColor>;
    static fromVisualFrames: (prevFrame: VisualFrame, nextFrame: VisualFrame) => AdditiveFrame;
    get size(): number;
    toBytes: () => Uint8Array;
}
