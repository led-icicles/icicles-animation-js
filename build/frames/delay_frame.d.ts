import { Frame, FrameType } from "./frame";
export default class DelayFrame extends Frame {
    readonly duration: number;
    readonly type: FrameType;
    constructor(duration: number);
    get size(): number;
    toBytes: () => Uint8Array;
}
