import { Color } from "../utils/color";
import { Frame, FrameType } from "./frame";
export declare class RadioColorFrame extends Frame {
    readonly panelIndex: number;
    readonly color: Color;
    readonly duration: number;
    static readonly maxPanelIndex: number;
    readonly type: FrameType;
    constructor(panelIndex: number, color: Color, duration: number);
    get size(): number;
    toBytes: () => Uint8Array;
    copy: () => RadioColorFrame;
    copyWith: ({ duration, color, panelIndex, }?: {
        duration?: number | undefined;
        color?: Color | undefined;
        panelIndex?: number | undefined;
    }) => RadioColorFrame;
}
