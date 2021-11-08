import { Color } from "../color";
import { Frame, FrameType } from "./frame";
export declare class VisualFrame extends Frame {
    readonly pixels: Array<Color>;
    readonly duration: number;
    readonly type: FrameType;
    constructor(pixels: Array<Color>, duration: number);
    static assertVisualFramesCompatibility: (prevFrame: VisualFrame, nextFrame: VisualFrame) => void;
    copy: () => VisualFrame;
    get size(): number;
    static linearBlend: (from: VisualFrame, to: VisualFrame, progress: number, duration?: number | undefined) => VisualFrame;
    darken: (progress: number, duration?: number | undefined) => VisualFrame;
    toBytes: () => Uint8Array;
}
