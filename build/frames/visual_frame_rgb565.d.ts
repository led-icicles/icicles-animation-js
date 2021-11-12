import { Color } from "../utils";
import { Frame, FrameType } from "./frame";
export declare class VisualFrameRgb565 extends Frame {
    readonly pixels: Array<Color>;
    readonly duration: number;
    readonly type: FrameType;
    constructor(pixels: Array<Color>, duration: number);
    get size(): number;
    toBytes: () => Uint8Array;
}
