import { IndexedColor } from "../utils";
import { Frame, FrameType } from "./frame";
export declare class AdditiveFrameRgb565 extends Frame {
    readonly changedPixels: Array<IndexedColor>;
    readonly duration: number;
    readonly type: FrameType;
    constructor(changedPixels: Array<IndexedColor>, duration: number);
    get size(): number;
    toBytes: () => Uint8Array;
}
